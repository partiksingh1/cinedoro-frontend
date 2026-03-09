import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FilmService } from '../../../services/film.service';
import { Film } from '../../../models/film';
import { Screening } from '../../../models/screening';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-screening-by-film',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './screening-by-film.html',
  styleUrls: ['./screening-by-film.css']
})
export class ScreeningByFilmComponent {

  film: Film | null = null;
  screenings: Screening[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private filmService: FilmService
  ) {
    this.route.paramMap.pipe(
      map(params => Number(params.get('filmId'))),
      switchMap(filmId => this.filmService.getFilmById(filmId)),
      tap(() => this.loading = false)
    ).subscribe({
      next: (film) => {
        this.film = film;
        this.screenings = film.screenings || [];
      },
      error: (err) => {
        console.error('Failed to load film', err);
        this.loading = false;
      }
    });
  }

  // Group screenings by date
  getGroupedScreenings(): { [date: string]: Screening[] } {
    const grouped: { [key: string]: Screening[] } = {};
    this.screenings.forEach(s => {
      if (!grouped[s.screeningDate]) {
        grouped[s.screeningDate] = [];
      }
      grouped[s.screeningDate].push(s);
    });
    return grouped;
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  formatTime(timeString: string) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  }

  goBack() {
    this.router.navigate(['/films']);
  }

}