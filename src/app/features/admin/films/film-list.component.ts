import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Observable } from 'rxjs'
import { RouterModule } from "@angular/router";
import { FilmService } from '../../../services/film.service';
import { Film } from '../../../models/film';

@Component({
    standalone: true,
    selector: 'app-film-list',
    imports: [CommonModule, RouterModule],
    templateUrl: './film-list.component.html'
})
export class AdminFilmListComponent {

    films$: Observable<Film[]>;

    constructor(private filmService: FilmService) {
        this.films$ = this.filmService.getAllFilms();

    }

    deleteFilm(id: number) {
        this.filmService.deleteFilm(id).subscribe(() => {
            this.films$ = this.filmService.getAllFilms();
        });
    }

}