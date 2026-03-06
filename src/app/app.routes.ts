import { Routes } from '@angular/router';
import { FilmListComponent } from './features/films/film-list.component';
import { ScreeningByFilmComponent } from './features/screenings/screening-by-film/screening-by-film';
import { ScreeningByDateComponent } from './features/screenings/screening-by-date/screening-by-date';
import { AdminComponent } from './features/admin/admin.component';
import { ActorListComponent } from './features/actors/actor-list.component';
import { DirectorListComponent } from './features/directors/director-list.component';
import { FilmDetail } from './features/film-detail/film-detail';
import { BookingComponent } from './features/booking/booking';
import { AdminFilmListComponent } from './features/admin/films/film-list.component';
import { GenreListComponent } from './features/admin/genres/genre-list.component';
import { FilmCreateComponent } from './features/admin/films/film-create/film-create';
import { FilmEditComponent } from './features/admin/films/film-edit/film-edit';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
    { path: '', component: FilmListComponent },
    { path: 'films', component: FilmListComponent },
    { path: 'film/detail/:filmId', component: FilmDetail },
    { path: 'booking/:screeningId', component: BookingComponent },
    { path: 'screenings/film/:filmId', component: ScreeningByFilmComponent },
    { path: 'screenings/date', component: ScreeningByDateComponent },

    {
        path: '',
        redirectTo: 'films',
        pathMatch: 'full'
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'admin/films',
        component: AdminFilmListComponent
    },
    {
        path: 'admin/genres',
        component: GenreListComponent
    },
    {
        path: 'admin/actors',
        component: ActorListComponent
    },
    {
        path: 'admin/directors',
        component: DirectorListComponent
    },
    {
        path: 'admin/films/create',
        component: FilmCreateComponent
    },
    {
        path: 'admin/films/edit/:id',
        component: FilmEditComponent
    },
    {
        path: 'login',
        component: Login
    }
];
