import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { Screening } from '../../models/screening';
import { Film } from '../../models/film';
import { SeatService } from '../../services/seat.service';
import { CinemaService, CinemaServiceService } from '../../services/cinema-service.service';
import { ScreeningService } from '../../services/screening.service';
import { FilmService } from '../../services/film.service';
import { BookingService } from '../../services/booking.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { Seat } from '../../models/seat';
interface BookingViewModel {
  screening: Screening;
  film: Film;
  seats: Seat[];
  services: CinemaService[];
}

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-booking',
  templateUrl: './booking.html',
  styleUrls: ['./booking.css'],
  standalone: true
})
export class BookingComponent {

  // Observables for reactive template
  bookingData$!: Observable<BookingViewModel>;
  selectedSeats: number[] = [];
  selectedServices: { [key: number]: number } = {};
  bookingInProgress = false;
  occupiedSeats: number[] = [];
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private screeningService: ScreeningService,
    private filmService: FilmService,
    private seatService: SeatService,
    private cinemaServiceService: CinemaServiceService,
    private bookingService: BookingService,
    private ticketService: TicketService,
    private userService: UserService
  ) {
    const screeningId = Number(this.route.snapshot.paramMap.get('screeningId'));

    // Get current user ID from UserService
    const userToken = this.userService.getToken();
    if (!userToken) {
      alert('Please log in to make a booking');
      this.router.navigate(['/login']);
      return;
    }

    // Combine all observables into one reactive data stream
    this.bookingData$ = this.screeningService.getScreeningById(screeningId).pipe(
      switchMap(screening => {
        // Load occupied seats for this screening
        return this.ticketService.getOccupiedSeats(screening.id || 0).pipe(
          map(occupied => ({ screening, occupiedSeats: occupied }))
        );
      }),
      switchMap(({ screening, occupiedSeats }) => {
        this.occupiedSeats = occupiedSeats;
        return combineLatest([
          this.filmService.getFilmById(screening.filmId),
          this.seatService.getSeatsByHall(screening.hallId),
          this.cinemaServiceService.getAllServices()
        ]).pipe(
          map(([film, seats, services]) => ({ screening, film, seats, services }))
        );
      })
    );
  }

  toggleSeat(seatId: number) {
    // Don't allow selecting occupied seats
    if (this.occupiedSeats.includes(seatId)) {
      return;
    }

    if (this.selectedSeats.includes(seatId)) {
      this.selectedSeats = this.selectedSeats.filter(id => id !== seatId);
    } else {
      this.selectedSeats.push(seatId);
    }
  }

  isSeatOccupied(seatId: number): boolean {
    return this.occupiedSeats.includes(seatId);
  }

  updateServiceQuantity(serviceId: number, quantity: number) {
    if (quantity <= 0) {
      delete this.selectedServices[serviceId];
    } else {
      this.selectedServices[serviceId] = quantity;
    }
  }

  calculateTotal(viewModel: BookingViewModel): number {
    const ticketsTotal = this.selectedSeats.length * viewModel.screening.basePrice;
    const servicesTotal = Object.entries(this.selectedServices)
      .reduce((sum, [id, qty]) => {
        const service = viewModel.services.find(s => s.id === Number(id));
        return sum + (service ? service.price * qty : 0);
      }, 0);
    return ticketsTotal + servicesTotal;
  }

  handleBooking(viewModel: BookingViewModel) {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    // Get current user ID from token or localStorage
    const userId = this.getCurrentUserId();
    if (!userId) {
      alert('Please log in to complete the booking');
      this.router.navigate(['/login']);
      return;
    }

    if (this.bookingInProgress) {
      return;
    }

    this.bookingInProgress = true;

    this.bookingService.createBooking({
      userId: userId,
      screeningId: viewModel.screening.id || 0,
      totalPrice: this.calculateTotal(viewModel)
    }).subscribe({
      next: booking => {
        // Create all tickets in parallel
        const ticketObservables = this.selectedSeats.map(seatId =>
          this.ticketService.createTicket({
            bookingId: booking.id,
            screeningId: viewModel.screening.id || 0,
            seatId,
            price: viewModel.screening.basePrice
          })
        );

        combineLatest(ticketObservables).subscribe({
          next: () => {
            // If there are extra services, add them to the booking
            const bookedServices = Object.entries(this.selectedServices)
              .filter(([_, qty]) => qty > 0)
              .map(([serviceId, qty]) => ({
                bookingId: booking.id,
                extraProductId: Number(serviceId),
                quantity: qty
              }));

            if (bookedServices.length > 0) {
              this.bookingService.addServicesToBooking(bookedServices).subscribe({
                next: () => {
                  this.router.navigate(['/ticket', booking.id]);
                  this.bookingInProgress = false;
                },
                error: err => {
                  console.error('Failed to add services to booking', err);
                  // Still navigate to ticket page even if services failed
                  this.router.navigate(['/ticket', booking.id]);
                  this.bookingInProgress = false;
                }
              });
            } else {
              this.router.navigate(['/ticket', booking.id]);
              this.bookingInProgress = false;
            }
          },
          error: err => {
            console.error('Ticket creation failed', err);
            alert('Failed to create tickets. Your booking may be incomplete. Please contact support.');
            this.bookingInProgress = false;
          }
        });
      },
      error: err => {
        console.error('Booking failed', err);
        alert('Failed to create booking. Please try again.');
        this.bookingInProgress = false;
      }
    });
  }

  private getCurrentUserId(): number | null {
    // Try to get from sessionStorage or localStorage
    const userIdStr = localStorage.getItem('userId');
    if (userIdStr) {
      return parseInt(userIdStr, 10);
    }
    // If not available, the user should log in
    return null;
  }

  getSeatsByRow(seats: Seat[]): { [row: number]: Seat[] } {
    const grouped: { [row: number]: Seat[] } = {};
    seats.forEach(seat => {
      if (!grouped[seat.rowNumber]) grouped[seat.rowNumber] = [];
      grouped[seat.rowNumber].push(seat);
    });
    return grouped;
  }

}