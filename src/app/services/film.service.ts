import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Film } from '../models/film'

@Injectable({
    providedIn: 'root'
})
export class FilmService {

    private api = 'http://localhost:8080/api/film'

    constructor(private http: HttpClient) { }

    getAllFilms(): Observable<Film[]> {
        return this.http.get<Film[]>(`${this.api}`)
    }

    getFilmById(id: number): Observable<Film> {
        return this.http.get<Film>(`${this.api}/${id}`)
    }

    createFilm(film: any) {
        return this.http.post<Film>(this.api, film);
    }

    updateFilm(id: number, film: Film) {
        return this.http.put(`${this.api}/${id}`, film)
    }

    deleteFilm(id: number) {
        return this.http.delete(`${this.api}/${id}`)
    }

    // Chiamata al backend per ottenere i film suggeriti per un utente specifico.
    getSuggestedForUser(userId: number): Observable<Film[]> {
    return this.http.get<Film[]>(`${this.api}/suggested?userId=${userId}`)
  }

}