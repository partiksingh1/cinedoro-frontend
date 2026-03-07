import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { BookingService, BookingDTO } from '../../services/booking.service';
import { TicketService, Ticket } from '../../services/ticket.service';
import { ScreeningService } from '../../services/screening.service';
import { FilmService } from '../../services/film.service';
import { SeatService } from '../../services/seat.service';

interface BookingDetails {
    booking: any;
    tickets: Ticket[];
    screening?: any;
    film?: any;
    seats: any[];
}

@Component({
    selector: 'app-my-bookings',
    templateUrl: './my-bookings.component.html',
    styleUrls: ['./my-bookings.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class MyBookingsComponent implements OnInit {

    bookings: any[] = [];

    constructor(private bookingService: BookingService) { }

    ngOnInit() {
        let userId = Number(localStorage.getItem('userId'));
        this.bookingService.getBookingDetails(userId)
            .subscribe(data => {
                this.bookings = data;
            });

    }


}