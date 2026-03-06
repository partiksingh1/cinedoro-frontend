import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CinemaServiceModel } from '../models/cinema-service';

@Injectable({
  providedIn: 'root'
})
export class CinemaServiceService {

  private apiUrl = 'http://localhost:8080/api/cinema-services';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CinemaServiceModel[]> {
    return this.http.get<CinemaServiceModel[]>(this.apiUrl);
  }

  create(service: CinemaServiceModel): Observable<CinemaServiceModel> {
    return this.http.post<CinemaServiceModel>(this.apiUrl, service);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}