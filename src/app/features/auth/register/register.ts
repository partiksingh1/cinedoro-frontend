import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class UserRegistration {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';

  errorMsg = '';
  isSubmitting = false;

  constructor(private authService: AuthService, private router: Router) {}

  submit(f: NgForm) {
    this.errorMsg = '';

    if (f.invalid) {
      this.errorMsg = 'Compila tutti i campi.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMsg = 'Le password non coincidono.';
      return;
    }

    const payload = {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName
    };

    this.isSubmitting = true;

    // endpoint: /api/auth/register (se nel tuo backend è così)
    this.authService.register(payload).subscribe({
      next: (res: any) => {
        console.log('REGISTER OK', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('REGISTER ERROR', err);
        this.errorMsg = err?.status === 409 ? 'Email già registrata.' : 'Errore durante la registrazione.';
        this.isSubmitting = false;
      },
      complete: () => (this.isSubmitting = false)
    });
  }
}