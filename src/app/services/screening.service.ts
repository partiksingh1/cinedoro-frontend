import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Screening } from '../models/screening'

@Injectable({
    providedIn: 'root'
})
export class ScreeningService {

    private apiUrl = 'http://localhost:8080/api/screenings'

    constructor(private http: HttpClient) { }

    getAllScreenings(): Observable<Screening[]> {
        return this.http.get<Screening[]>(this.apiUrl)
    }

    getScreeningsByFilm(filmId: number): Observable<Screening[]> {
        return this.http.get<Screening[]>(`${this.apiUrl}/film/${filmId}`)
    }

    getScreeningsByDate(date: string): Observable<Screening[]> {
        return this.http.get<Screening[]>(`${this.apiUrl}/date?date=${date}`)
    }
    getScreeningById(id: number): Observable<Screening> {
        return this.http.get<Screening>(`${this.apiUrl}/${id}`);
    }

    create(screening: Screening): Observable<Screening> {
        return this.http.post<Screening>(this.apiUrl, screening);
    }

    update(screening: Screening): Observable<Screening> {
        return this.http.put<Screening>(`${this.apiUrl}/${screening.id}`, screening);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}