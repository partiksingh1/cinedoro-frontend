import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Director } from '../models/director';

@Injectable({
  providedIn: 'root'
})
export class DirectorService {

  private apiUrl = 'http://localhost:8080/api/director';

  constructor(private http: HttpClient) {}

  getAllDirectors(): Observable<Director[]> {
    return this.http.get<Director[]>(this.apiUrl);
  }

}