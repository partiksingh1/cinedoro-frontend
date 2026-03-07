import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateHallRequest, Hall } from '../models/hall';

@Injectable({
  providedIn: 'root',
})
export class HallService {
  private apiUrl = 'http://localhost:8080/api/halls';

  constructor(private http: HttpClient) {}

  getAllHalls(): Observable<Hall[]> {
    return this.http.get<Hall[]>(this.apiUrl);
  }

  getHallById(id: number): Observable<Hall> {
    return this.http.get<Hall>(`${this.apiUrl}/${id}`);
  }

  createHall(hall: CreateHallRequest): Observable<Hall> {
    return this.http.post<Hall>(this.apiUrl, hall);
  }
}