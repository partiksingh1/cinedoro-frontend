import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Actor, ActorService } from '../../../../app/services/actor.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-actor',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './actor.html',
  styleUrls: ['./actor.css'],
})
export class ActorComponent implements OnInit {
  actors: Actor[] = [];
  newActor: Partial<Actor> = { name: '', surname: '', birthdate: '' };
  editActor: Partial<Actor> | null = null;
  editingActorId: number | null = null;
  showCreateForm = false;
  showEditForm = false;
  loading = true;

  constructor(private actorService: ActorService) { }

  ngOnInit(): void {
    this.loadActors();
  }

  loadActors(): void {
    this.loading = true;
    this.actorService.getAllActors().subscribe({
      next: (data) => {
        this.actors = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching actors', err);
        this.loading = false;
      },
    });
  }

  showCreateActorForm(): void {
    this.showCreateForm = true;
    this.newActor = { name: '', surname: '', birthdate: '' };
  }

  cancelCreate(): void {
    this.showCreateForm = false;
  }

  createActor(): void {
    if (this.newActor.name && this.newActor.surname) {
      this.actorService.createActor(this.newActor as Actor).subscribe({
        next: () => {
          this.loadActors();
          this.cancelCreate();
        },
        error: (err) => console.error('Error creating actor', err),
      });
    }
  }

  showEditActorForm(actor: Actor): void {
    this.editActor = { ...actor };
    this.editingActorId = actor.id!;
    this.showEditForm = true;
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editActor = null;
    this.editingActorId = null;
  }

  onEditInputChange(event: Event, field: 'name' | 'surname' | 'birthdate'): void {
    if (this.editActor) {
      const value = (event.target as HTMLInputElement).value;
      (this.editActor as any)[field] = value;
    }
  }

  updateActor(): void {
    if (this.editActor && this.editingActorId) {
      this.actorService.updateActor(this.editingActorId, this.editActor as Actor).subscribe({
        next: () => {
          this.loadActors();
          this.cancelEdit();
        },
        error: (err) => console.error('Error updating actor', err),
      });
    }
  }

  deleteActor(id: number): void {
    this.actorService.deleteActor(id).subscribe({
      next: () => this.loadActors(),
      error: (err) => console.error('Error deleting actor', err),
    });
  }
}