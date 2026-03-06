import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ScreeningService } from '../../../services/screening.service';
import { Screening } from '../../../models/screening';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-screening-by-film',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './screening-by-film.html'
})
export class ScreeningByFilmComponent {

  screenings$: Observable<Screening[]>;

  constructor(
    private route: ActivatedRoute,
    private screeningService: ScreeningService
  ) {
    this.screenings$ = this.route.paramMap.pipe(
      map(params => Number(params.get('filmId'))),
      switchMap(filmId => this.screeningService.getScreeningsByFilm(filmId))
    );
  }

}