import { Routes } from '@angular/router';
import { FilmListComponent } from './features/films/film-list.component';
import { ScreeningByFilmComponent } from './features/screenings/screening-by-film/screening-by-film';
import { ScreeningByDateComponent } from './features/screenings/screening-by-date/screening-by-date';
import { FilmDetail } from './features/film-detail/film-detail';
import { BookingComponent } from './features/booking/booking';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
    { path: '', component: FilmListComponent },
    { path: 'films', component: FilmListComponent },
    { path: 'film/detail/:filmId', component: FilmDetail },
    { path: 'booking/:screeningId', component: BookingComponent },
    { path: 'screenings/film/:filmId', component: ScreeningByFilmComponent },
    { path: 'screenings/date', component: ScreeningByDateComponent },
    { path: 'login', component: Login },
    { path: '', redirectTo: 'films', pathMatch: 'full' }
];
