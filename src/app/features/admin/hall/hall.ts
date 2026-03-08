import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Hall, CreateHallRequest } from '../../../../app/models/hall';
import { HallService } from '../../../../app/services/hall.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-hall',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './hall.html',
  styleUrl: './hall.css',
})
export class hall implements OnInit {
  halls: Hall[] = [];
  newHall: CreateHallRequest = { name: '', capacity: 0 };
  editHall: Hall | null = null;
  editingHallId: number | null = null;
  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  loading: boolean = true;

  constructor(private hallService: HallService) { }

  ngOnInit(): void {
    this.getAllHalls();
  }

  getAllHalls(): void {
    this.hallService.getAllHalls().subscribe({
      next: (data) => {
        this.halls = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching halls', err);
        this.loading = false;
      },
    });
  }

  showCreateHallForm(): void {
    this.showCreateForm = true;
    this.newHall = { name: '', capacity: 0 }; // Reset form
  }

  cancelCreate(): void {
    this.showCreateForm = false;
  }

  createHall(): void {
    if (this.newHall.name && this.newHall.capacity > 0) {
      this.hallService.createHall(this.newHall).subscribe({
        next: (hall) => {
          console.log('Hall created', hall);
          this.getAllHalls();
          this.cancelCreate();
        },
        error: (err) => console.error('Error creating hall', err),
      });
    }
  }

  showEditHallForm(hall: Hall): void {
    this.editHall = { ...hall }; // Create a copy for editing
    this.editingHallId = hall.id!;
    this.showEditForm = true;
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editHall = null;
    this.editingHallId = null;
  }

  onEditInputChange(event: Event, field: 'name' | 'capacity'): void {
    if (this.editHall) {
      const value = (event.target as HTMLInputElement).value;
      if (field === 'capacity') {
        this.editHall.capacity = parseInt(value, 10);
      } else {
        this.editHall.name = value;
      }
    }
  }

  updateHall(): void {
    if (this.editHall && this.editHall.id) {
      this.hallService.updateHall(this.editHall.id, this.editHall).subscribe({
        next: (hall) => {
          console.log('Hall updated', hall);
          this.getAllHalls();
          this.cancelEdit();
        },
        error: (err) => console.error('Error updating hall', err),
      });
    }
  }

  deleteHall(id: number): void {
    this.hallService.deleteHall(id).subscribe({
      next: () => {
        console.log('Hall deleted', id);
        this.getAllHalls();
      },
      error: (err) => console.error('Error deleting hall', err),
    });
  }
}
