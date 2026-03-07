import { Component, OnInit, signal } from '@angular/core';
import { ScreeningService } from '../../../services/screening.service';
import { Screening } from '../../../models/screening';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Film } from '../../../models/film';
import { FilmService } from '../../../services/film.service';
import { Hall } from '../../../models/hall';
import { HallService } from '../../../services/hall.service';


@Component({
  selector: 'app-admin-screening',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-screening.html',
  styleUrl: './admin-screening.css',
})

export class AdminScreening implements OnInit {

  screenings = signal<Screening[]>([]);
  films= signal<Film[]>([]);
  halls = signal<Hall[]>([]);

  newScreening: Screening = {
    filmId: 0,
    hallId: 0,
    screeningDate: '',
    screeningTime: '',
    basePrice: 0
  };

  editingScreening= signal<Screening | null>(null);

  constructor(
    private screeningService: ScreeningService,
    private filmService: FilmService,
    private hallService: HallService
  ) { }

  ngOnInit(): void {
    this.loadScreenings();
    this.loadFilms();
    this.loadHalls();
  }

  loadScreenings() {
    this.screeningService.getAllScreenings()
      .subscribe(sub => this.screenings.set(sub));
  }

  loadFilms() {
    this.filmService.getAllFilms().subscribe(sub => this.films.set(sub));
  }

  loadHalls() {
    this.hallService.getAllHalls().subscribe(sub => this.halls.set(sub));
  }

  createScreening() {
    this.screeningService.create(this.newScreening)
    .subscribe(() => {

      alert("Proiezione creata");
        this.newScreening = {
          filmId: 0,
          hallId: 0,
          screeningDate: '',
          screeningTime: '',
          basePrice: 0
        };
      this.loadScreenings();
    });
  }

  deleteScreening(id?: number) {
    if(!id) return;
    if(!confirm("Sei sicuro di voler eliminare la proiezione?")) return;
    this.screeningService.delete(id)
    .subscribe(() => {
      alert("Proiezione eliminata");
      this.loadScreenings();
    })

  }

  startEdit(screening: Screening) {
    this.editingScreening.set({ ...screening});
  }

  updateScreening() {
    const screeningToUpdate = this.editingScreening();
    if(!screeningToUpdate) return;
    this.screeningService.update(screeningToUpdate)
    .subscribe({
      next: () => { alert("Proiezione aggiornata"); 
        this.editingScreening.set(null); 
        this.loadScreenings(); },
      error: () => { alert("Errore nella modifica"); }  
    });
  }

  getFilmTitle(filmId: number) {
    const film = this.films().find(f => f.id === filmId);
    return film ? film.title : '';
  }

  getHallName(hallId: number) {
    const hall = this.halls().find(h => h.id === hallId);
    return hall ? hall.name : '';
  }

}


