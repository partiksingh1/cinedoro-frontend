import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Screening } from '../../models/screening';
import { Film } from '../../models/film';
import { Seat, SeatService } from '../../services/seat.service';
import { CinemaService, CinemaServiceService } from '../../services/cinema-service.service';
import { ScreeningService } from '../../services/screening.service';
import { FilmService } from '../../services/film.service';
import { BookingService } from '../../services/booking.service';
import { TicketService } from '../../services/ticket.service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-booking',
  templateUrl: './booking.html',
  styleUrls: ['./booking.css'],
  standalone: true
})
export class BookingComponent implements OnInit {

  screening!: Screening;
  film!: Film;

  seats: Seat[] = [];
  services: CinemaService[] = [];

  selectedSeats: number[] = [];
  selectedServices: { [key: number]: number } = {};

  loading = true;
  bookingInProgress = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private screeningService: ScreeningService,
    private filmService: FilmService,
    private seatService: SeatService,
    private cinemaServiceService: CinemaServiceService,
    private bookingService: BookingService,
    private ticketService: TicketService
  ) { }

  ngOnInit(): void {

    const screeningId = Number(this.route.snapshot.paramMap.get('screeningId'));

    this.screeningService.getScreeningById(screeningId).pipe(

      switchMap(screening => {
        this.screening = screening;

        return forkJoin({
          film: this.filmService.getFilmById(screening.filmId),
          seats: this.seatService.getSeatsByHall(screening.hallId),
          services: this.cinemaServiceService.getAllServices()
        });
      })

    ).subscribe(data => {
      this.film = data.film;
      this.seats = data.seats;
      this.services = data.services;
      this.loading = false;
    });

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

  calculateTotal(): number {

    const ticketsTotal = this.selectedSeats.length * this.screening.basePrice;

    const servicesTotal = Object.entries(this.selectedServices)
      .reduce((sum, [id, qty]) => {

        const service = this.services.find(s => s.id === Number(id));
        return sum + (service ? service.price * qty : 0);

      }, 0);

    return ticketsTotal + servicesTotal;
  }

  handleBooking() {

    if (this.selectedSeats.length === 0) {
      alert('Select at least one seat');
      return;
    }

    this.bookingInProgress = true;

    this.bookingService.createBooking({
      userId: 1,
      screeningId: this.screening.id || 0,
      totalPrice: this.calculateTotal()
    }).subscribe(booking => {

      this.selectedSeats.forEach(seatId => {

        this.ticketService.createTicket({
          bookingId: booking.id,
          screeningId: this.screening.id || 0,
          seatId: seatId,
          price: this.screening.basePrice
        }).subscribe();

      });

      alert('Booking successful!');
      this.router.navigate(['/films']);

    });

  }

  getSeatsByRow(): { [row: number]: Seat[] } {

    const grouped: { [row: number]: Seat[] } = {};

    this.seats.forEach(seat => {

      if (!grouped[seat.rowNumber]) {
        grouped[seat.rowNumber] = [];
      }

      grouped[seat.rowNumber].push(seat);

    });

    return grouped;
  }

}