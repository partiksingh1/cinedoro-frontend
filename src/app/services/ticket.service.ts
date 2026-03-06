import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ticket {
    id: number;
    bookingId: number;
    screeningId: number;
    seatId: number;
    price: number;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
    private baseUrl = 'http://localhost:8080/api/tickets';

    constructor(private http: HttpClient) { }

    createTicket(ticket: { bookingId: number; screeningId: number; seatId: number; price: number }): Observable<Ticket> {
        return this.http.post<Ticket>(this.baseUrl, ticket);
    }
}