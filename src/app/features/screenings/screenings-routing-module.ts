import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreeningByFilmComponent } from './screening-by-film/screening-by-film';
import { ScreeningByDateComponent } from './screening-by-date/screening-by-date';

const routes: Routes = [
  { path: 'film/:filmId', component: ScreeningByFilmComponent },
  { path: 'date', component: ScreeningByDateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreeningsRoutingModule { }