import { Routes } from '@angular/router';
import { FilmListComponent } from './features/films/film-list.component';
import { ScreeningByFilmComponent } from './features/screenings/screening-by-film/screening-by-film';
import { ScreeningByDateComponent } from './features/screenings/screening-by-date/screening-by-date';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
  {
    path: 'films',
    component: FilmListComponent,
  },
  { path: 'screenings/film/:filmId', component: ScreeningByFilmComponent },
  { path: 'screenings/date', component: ScreeningByDateComponent },
  { path: 'login', component: Login },

  {
    path: '',
    redirectTo: 'films',
    pathMatch: 'full',
  },
];
