import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { Screening } from '../../models/screening';
import { Film } from '../../models/film';
import { CinemaServiceModel } from '../../models/cinema-service';
import { Seat, SeatService } from '../../services/seat.service';
import { CinemaServiceService } from '../../services/cinema-service.service';
import { ScreeningService } from '../../services/screening.service';
import { FilmService } from '../../services/film.service';
import { BookingService } from '../../services/booking.service';
import { TicketService } from '../../services/ticket.service';

interface BookingViewModel {
  screening: Screening;
  film: Film;
  seats: Seat[];
  services: CinemaServiceModel[];
}

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-booking',
  templateUrl: './booking.html',
  styleUrls: ['./booking.css'],
  standalone: true
})
export class BookingComponent {

  bookingData$: Observable<BookingViewModel>;
  selectedSeats: number[] = [];
  selectedServices: { [key: number]: number } = {};
  bookingInProgress = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private screeningService: ScreeningService,
    private filmService: FilmService,
    private seatService: SeatService,
    private cinemaService: CinemaServiceService,
    private bookingService: BookingService,
    private ticketService: TicketService
  ) {
    const screeningId = Number(this.route.snapshot.paramMap.get('screeningId'));

    this.bookingData$ = this.screeningService.getScreeningById(screeningId).pipe(
      switchMap(screening =>
        combineLatest([
          this.filmService.getFilmById(screening.filmId),
          this.seatService.getSeatsByHall(screening.hallId),
          this.cinemaService.getAll()
        ]).pipe(
          map(([film, seats, services]) => ({
            screening,
            film,
            seats,
            services
          }))
        )
      )
    );
  }

  toggleSeat(seatId: number) {
    if (this.selectedSeats.includes(seatId)) {
      this.selectedSeats = this.selectedSeats.filter(id => id !== seatId);
    } else {
      this.selectedSeats.push(seatId);
    }
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
      alert('Select at least one seat');
      return;
    }

    this.bookingInProgress = true;

    this.bookingService.createBooking({
      userId: 1,
      screeningId: viewModel.screening.id || 0,
      totalPrice: this.calculateTotal(viewModel)
    }).subscribe({
      next: booking => {
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
            alert('Booking successful!');
            this.router.navigate(['/films']);
            this.bookingInProgress = false;
          },
          error: err => {
            console.error('Ticket creation failed', err);
            alert('Booking failed. Please try again.');
            this.bookingInProgress = false;
          }
        });
      },
      error: err => {
        console.error('Booking failed', err);
        alert('Booking failed. Please try again.');
        this.bookingInProgress = false;
      }
    });
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