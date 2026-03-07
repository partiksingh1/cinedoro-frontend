import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActorService } from '../../../services/actor.service';
import { Actor } from '../../../models/actor';

@Component({
  selector: 'app-actor-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actor.html',
  styleUrl: './actor.css'
})
export class ActorAdminComponent implements OnInit {

  actors: Actor[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // form per creare/modificare
  showForm: boolean = false;
  isEditing: boolean = false;
  selectedActor: Actor = this.emptyActor();

  constructor(private actorService: ActorService) {}

  ngOnInit() {
    this.loadActors();
  }

  emptyActor(): Actor {
    return {
      id: 0,
      firstName: '',
      lastName: '',
      birthDate: '',
      nationality: ''
    };
  }

  loadActors() {
    this.loading = true;
    this.actorService.getAllActors().subscribe({
      next: (data) => {
        this.actors = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Errore nel caricamento degli attori';
        this.loading = false;
      }
    });
  }

  openCreateForm() {
    this.selectedActor = this.emptyActor();
    this.isEditing = false;
    this.showForm = true;
  }

  openEditForm(actor: Actor) {
    this.selectedActor = { ...actor }; // copia l'attore per non modificare l'originale
    this.isEditing = true;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  save() {
    if (this.isEditing) {
      this.actorService.updateActor(this.selectedActor.id, this.selectedActor).subscribe({
        next: () => {
          this.successMessage = 'Attore aggiornato con successo';
          this.loadActors();
          this.closeForm();
        },
        error: () => this.errorMessage = 'Errore durante la modifica'
      });
    } else {
      this.actorService.createActor(this.selectedActor).subscribe({
        next: () => {
          this.successMessage = 'Attore creato con successo';
          this.loadActors();
          this.closeForm();
        },
        error: () => this.errorMessage = 'Errore durante la creazione'
      });
    }
  }

  delete(id: number) {
    if (!confirm('Sei sicuro di voler eliminare questo attore?')) return;
    this.actorService.deleteActor(id).subscribe({
      next: () => {
        this.successMessage = 'Attore eliminato con successo';
        this.loadActors();
      },
      error: () => this.errorMessage = 'Errore durante la cancellazione'
    });
  }
}