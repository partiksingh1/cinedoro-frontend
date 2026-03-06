import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CinemaServiceService } from '../../../services/cinema-service.service';
import { CinemaServiceModel } from '../../../models/cinema-service';

@Component({
  selector: 'app-cinema-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cinema-service.html',
  styleUrls: ['./cinema-service.css']
})
export class CinemaServiceComponent implements OnInit {

  services: CinemaServiceModel[] = [];

  serviceForm: CinemaServiceModel = {
    name: '',
    description: '',
    price: 0
  };

  errorMsg = '';
  successMsg = '';

  constructor(private cinemaService: CinemaServiceService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadServices();
  }

loadServices(): void {
  this.cinemaService.getAll().subscribe({
    next: (data) => {
      console.log('SERVICES FROM API:', data);
      this.services = [...data];
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
      this.errorMsg = 'Errore nel caricamento dei servizi cinema';
      this.cdr.detectChanges();
    }
  });
}

createService(form: NgForm): void {
  this.errorMsg = '';
  this.successMsg = '';

  if (form.invalid) {
    this.errorMsg = 'Compila tutti i campi';
    return;
  }

  this.cinemaService.create(this.serviceForm).subscribe({
    next: (created) => {
      this.successMsg = 'Servizio creato con successo';
      this.services = [...this.services, created];

      this.serviceForm = {
        name: '',
        description: '',
        price: 0
      };

      form.resetForm({
        name: '',
        description: '',
        price: 0
      });

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
      this.errorMsg = 'Errore durante la creazione del servizio';
      this.cdr.detectChanges();
    }
  });
}

deleteService(id: number): void {
  const confirmed = confirm('Sei sicuro di voler eliminare questo servizio?');
  if (!confirmed) return;

  this.cinemaService.delete(id).subscribe({
    next: () => {
      this.services = this.services.filter(service => service.id !== id);
      this.successMsg = 'Servizio eliminato con successo';
      this.errorMsg = '';
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
      this.errorMsg = 'Errore durante l’eliminazione del servizio';
      this.successMsg = '';
      this.cdr.detectChanges();
    }
  });
}
}