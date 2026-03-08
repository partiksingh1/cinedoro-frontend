import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Screening } from '../../../../app/models/screening';
import { Film } from '../../../../app/models/film'; // New import
import { Hall } from '../../../../app/models/hall'; // New import
import { ScreeningService } from '../../../../app/services/screening.service';
import { FilmService } from '../../../../app/services/film.service'; // New import
import { HallService } from '../../../../app/services/hall.service'; // New import
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-screenings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './screenings.html',
  styleUrl: './screenings.css',
})
export class Screenings implements OnInit {
  screenings: Screening[] = [];
  films: Film[] = []; // New property
  halls: Hall[] = []; // New property
  newScreening: Partial<Screening> = { filmId: 0, hallId: 0, screeningDate: '', screeningTime: '', basePrice: 0 }; // Updated type
  editScreening: Partial<Screening> | null = null; // Updated type
  editingScreeningId: number | null = null;
  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  loading: boolean = true;

  constructor(
    private screeningService: ScreeningService,
    private filmService: FilmService, // New injection
    private hallService: HallService // New injection
  ) { }

  ngOnInit(): void {
    this.getAllScreenings();
    this.loadFilms(); // New call
    this.loadHalls(); // New call
  }

  getAllScreenings(): void {
    this.screeningService.getAllScreenings().subscribe({
      next: (data) => {
        this.screenings = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching screenings', err);
        this.loading = false;
      },
    });
  }

  loadFilms(): void {
    this.filmService.getAllFilms().subscribe({
      next: (data) => {
        this.films = data;
      },
      error: (err) => console.error('Error fetching films', err),
    });
  }

  loadHalls(): void {
    this.hallService.getAllHalls().subscribe({
      next: (data) => {
        this.halls = data;
      },
      error: (err) => console.error('Error fetching halls', err),
    });
  }

  showCreateScreeningForm(): void {
    this.showCreateForm = true;
    this.newScreening = { filmId: 0, hallId: 0, screeningDate: '', screeningTime: '', basePrice: 0 }; // Updated initialization
  }

  cancelCreate(): void {
    this.showCreateForm = false;
  }

  createScreening(): void {
    if (this.newScreening.filmId && this.newScreening.hallId && this.newScreening.screeningDate && this.newScreening.screeningTime && this.newScreening.basePrice !== undefined) {
      this.screeningService.createScreening(this.newScreening as Screening).subscribe({
        next: (screening) => {
          console.log('Screening created', screening);
          this.getAllScreenings();
          this.cancelCreate();
        },
        error: (err) => console.error('Error creating screening', err),
      });
    }
  }

  showEditScreeningForm(screening: Screening): void {
    this.editScreening = { ...screening }; // Create a copy for editing
    this.editingScreeningId = screening.id!;
    this.showEditForm = true;
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editScreening = null;
    this.editingScreeningId = null;
  }

  updateScreening(): void {
    if (this.editScreening && this.editScreening.id) {
      this.screeningService.updateScreening(this.editScreening.id, this.editScreening as Screening).subscribe({
        next: (screening) => {
          console.log('Screening updated', screening);
          this.getAllScreenings();
          this.cancelEdit();
        },
        error: (err) => console.error('Error updating screening', err),
      });
    }
  }

  deleteScreening(id: number): void {
    this.screeningService.deleteScreening(id).subscribe({
      next: () => {
        console.log('Screening deleted', id);
        this.getAllScreenings();
      },
      error: (err) => console.error('Error deleting screening', err),
    });
  }
}
