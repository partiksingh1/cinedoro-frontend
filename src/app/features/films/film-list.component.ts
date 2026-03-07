import { Component, OnInit } from '@angular/core'
import { FilmService } from '../../services/film.service'
import { Film } from '../../models/film'
import { CommonModule } from '@angular/common'
import { Observable } from 'rxjs'
import { RouterModule } from "@angular/router";
import { UserService } from '../../services/user.service';

@Component({
    standalone: true,
    selector: 'app-film-list',
    imports: [CommonModule, RouterModule],
    templateUrl: './film-list.component.html'
})
export class FilmListComponent implements OnInit {

    films$: Observable<Film[]>;
    suggestedFilms: Film[] = [];
    loadingSuggested: boolean = false;
    isLoggedIn: boolean = false;

    constructor(
        private filmService: FilmService,
        private userService: UserService
    ) {
        this.films$ = this.filmService.getAllFilms();
    }

    ngOnInit() {
        this.isLoggedIn = this.userService.isLoggedIn();
        if (this.isLoggedIn) {
            this.loadSuggestedFilms();
        }
    }

    loadSuggestedFilms() {
        const userId = this.userService.getUserId();
        if (!userId) return;

        this.loadingSuggested = true;
        this.filmService.getSuggestedForUser(userId).subscribe({
            next: (data) => {
                this.suggestedFilms = data.slice(0, 4);
                this.loadingSuggested = false;
            },
            error: () => this.loadingSuggested = false
        });
    }

    deleteFilm(id: number) {
        this.filmService.deleteFilm(id).subscribe(() => {
            this.films$ = this.filmService.getAllFilms();
        });
    }
}