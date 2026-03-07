import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActorService } from '../../../services/actor.service';
import { Actor } from '../../../models/actor';

@Component({
  selector: 'app-actor-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actor.html',
  styleUrls: ['./actor.css']
})
export class ActorAdminComponent implements OnInit {

  actors: Actor[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  showForm: boolean = false;
  isEditing: boolean = false;
  selectedActor: Actor = this.emptyActor();

  constructor(
    private actorService: ActorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log("Component caricato");
    this.loadActors();
  }

  emptyActor(): Actor {
    return { id: 0, firstName: '', lastName: '', birthDate: '', nationality: '' };
  }

  loadActors() {
    this.loading = true;
    this.actorService.getAllActors().subscribe({
      next: (data) => {
        this.actors = [...data]; // forza nuovo riferimento
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore nel caricamento degli attori:', err);
        this.errorMessage = 'Errore nel caricamento degli attori';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openCreateForm() {
    this.selectedActor = this.emptyActor();
    this.isEditing = false;
    this.showForm = true;
  }

  openEditForm(actor: Actor) {
    this.selectedActor = { ...actor };
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
      // MODIFICA attore esistente
      this.actorService.updateActor(this.selectedActor.id, this.selectedActor).subscribe({
        next: () => {
          const index = this.actors.findIndex(a => a.id === this.selectedActor.id);
          if (index !== -1) this.actors[index] = { ...this.selectedActor };
          this.successMessage = 'Attore aggiornato con successo';
          this.closeForm();
        },
        error: (err) => {
          console.error('Errore durante la modifica:', err);
          this.errorMessage = 'Errore durante la modifica';
          this.cdr.detectChanges();
        }
      });
    } else {
      // CREAZIONE nuovo attore
      const actorToCreate = {
        firstName: this.selectedActor.firstName,
        lastName: this.selectedActor.lastName,
        birthDate: this.selectedActor.birthDate,
        nationality: this.selectedActor.nationality
      };

      this.actorService.createActor(actorToCreate as Actor).subscribe({
        next: (created) => {
          this.actors.push(created);
          this.successMessage = 'Attore creato con successo';
          this.closeForm();
        },
        error: (err) => {
          console.error('Errore durante la creazione:', err);
          this.errorMessage = 'Errore durante la creazione';
          this.cdr.detectChanges();
        }
      });
    }
  }

  delete(id: number) {
    if (!confirm('Sei sicuro di voler eliminare questo attore?')) return;

    this.actorService.deleteActor(id).subscribe({
      next: () => {
        this.actors = this.actors.filter(a => a.id !== id);
        this.successMessage = 'Attore eliminato con successo';
      },
      error: (err) => {
        console.error('Errore durante la cancellazione:', err);
        this.errorMessage = 'Errore durante la cancellazione';
        this.cdr.detectChanges();
      }
    });
  }
}

