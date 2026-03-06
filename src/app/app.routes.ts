import { Routes } from '@angular/router';
import { FilmListComponent } from './features/films/film-list.component';
import { ScreeningByFilmComponent } from './features/screenings/screening-by-film/screening-by-film';
import { ScreeningByDateComponent } from './features/screenings/screening-by-date/screening-by-date';
import { AdminComponent } from './features/admin/admin.component';
import { GenreListComponent } from './features/genres/genre-list.component';
import { ActorListComponent } from './features/actors/actor-list.component';
import { DirectorListComponent } from './features/directors/director-list.component';
import { FilmCreateComponent } from './features/films/film-create/film-create';
import { FilmEditComponent } from './features/films/film-edit/film-edit';
export const routes: Routes = [
    {
        path: 'films',
        component: FilmListComponent
    },
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
        component: FilmListComponent
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
    }
];
