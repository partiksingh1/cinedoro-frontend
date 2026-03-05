import { Component, OnInit } from '@angular/core'
import { FilmService } from '../../services/film.service'
import { Film } from '../../models/film'
import { CommonModule } from '@angular/common'
import { Observable } from 'rxjs'
import { RouterModule } from "@angular/router";

@Component({
    standalone: true,
    selector: 'app-film-list',
    imports: [CommonModule, RouterModule],
    templateUrl: './film-list.component.html'
})
export class FilmListComponent {

    films$: Observable<Film[]>;

    constructor(private filmService: FilmService) {
        this.films$ = this.filmService.getAllFilms();
    }

}