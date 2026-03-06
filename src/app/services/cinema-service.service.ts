import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CinemaService {
    id: number;
    name: string;
    description: string;
    price: number;
}

@Injectable({ providedIn: 'root' })
export class CinemaServiceService {
    private baseUrl = 'http://localhost:8080/api/cinema-services';

    constructor(private http: HttpClient) { }

    getAllServices(): Observable<CinemaService[]> {
        return this.http.get<CinemaService[]>(this.baseUrl);
    }
}