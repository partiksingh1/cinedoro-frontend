import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Film } from '../../../../models/film';
import { CommonModule } from '@angular/common';
import { Director } from '../../../../models/director';
import { FilmService } from '../../../../services/film.service';
import { Router } from '@angular/router';
import { DirectorService } from '../../../../services/director.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-film-create',
  templateUrl: './film-create.html'
})
export class FilmCreateComponent implements OnInit {

  film: Partial<Film> = {};
  directors: Director[] = [];

  constructor(
    private filmService: FilmService,
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit() {
  this.directorService.getAllDirectors().subscribe(directors => {
    this.directors = directors;
  });
}

 createFilm() {

  const filmRequest = {
    title: this.film.title ?? '',
    description: this.film.description ?? '',
    durationMinutes: this.film.durationMinutes ?? 0,
    releaseDate: this.film.releaseDate ?? '',
    ageRating: this.film.ageRating ?? 0,
    directorId: this.film.director?.id ?? 0
  };

  this.filmService.createFilm(filmRequest).subscribe({
    next: () => {
      this.router.navigate(['/films']);
    },
    error: (err) => {
      console.error(err);
    }
  });

}

}