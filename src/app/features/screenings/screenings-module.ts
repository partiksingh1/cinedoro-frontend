import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ScreeningByFilmComponent } from './screening-by-film/screening-by-film';
import { ScreeningByDateComponent } from './screening-by-date/screening-by-date';
import { ScreeningsRoutingModule } from './screenings-routing-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ScreeningsRoutingModule,

    // ✅ standalone components go here, not in declarations
    ScreeningByFilmComponent,
    ScreeningByDateComponent
  ]
})
export class ScreeningsModule { }