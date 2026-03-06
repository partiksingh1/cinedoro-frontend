import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookingDTO {
    id: number;
    userId: number;
    screeningId: number;
    totalPrice: number;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
    private baseUrl = 'http://localhost:8080/api/bookings';

    constructor(private http: HttpClient) { }

    createBooking(booking: { userId: number; screeningId: number; totalPrice: number }): Observable<BookingDTO> {
        return this.http.post<BookingDTO>(this.baseUrl, booking);
    }
}