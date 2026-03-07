import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actor } from '../models/actor';

@Injectable({
    providedIn: 'root'
})
export class ActorService {

    private api = 'http://localhost:8080/api/actors';

    constructor(private http: HttpClient) {}

    getAllActors(): Observable<Actor[]> {
        return this.http.get<Actor[]>(this.api);
    }

    getActorById(id: number): Observable<Actor> {
        return this.http.get<Actor>(`${this.api}/${id}`);
    }

    createActor(actor: Actor): Observable<Actor> {
        return this.http.post<Actor>(this.api, actor);
    }

    updateActor(id: number, actor: Actor): Observable<Actor> {
        return this.http.put<Actor>(`${this.api}/${id}`, actor);
    }

    deleteActor(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/${id}`);
    }
}