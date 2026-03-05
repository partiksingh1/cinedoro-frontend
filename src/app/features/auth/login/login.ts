import { Component } from '@angular/core'; // Permette di creare un componente Angular e usare @Component
import { FormsModule } from '@angular/forms'; // Serve per usare form-template-driven --> questo mi permette di usare [(ngModel)] negli input dei form
//se nel TS ho: email =''; e in HTML ho <input [(ngModel)]="email"/> --> Quandro scrivo ciccio@gmail.com, la variabile email = ciccio@gmail.com
import { Router } from '@angular/router'; // Serve per cambiare pagina da codice
import { finalize } from 'rxjs'; // è un operatore rxjs che esegue codice dopo un Observable
import { UserService } from '../../../services/user.service'; // importa il service che hai creato per fare login/register localStorage

@Component({
  // Dice che la classe sotto Login è un componente
  selector: 'app-login', // nome del tag HTML che comparira in index.html o altre pagine html
  imports: [FormsModule], // rende disponibile FormsModule dentro questo componente
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Valori collegati agli input del form tramite [(ngModel)].
  email = '';
  password = '';

  // Stato UI utile per mostrare messaggi ed evitare doppi submit.
  isLoading = false;
  errorMessage = '';

  // Angular inietta automaticamente service e router nel componente.
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  // Questo metodo parte quando il form viene inviato con (ngSubmit). --> <form (ngSubmit)="onSubmit()">
  onSubmit(): void {
    // Controllo minimo lato frontend prima della chiamata HTTP.
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Inserisci email e password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.userService
      .login({
        email: this.email,
        password: this.password,
      })
      .pipe(
        // finalize viene eseguito sia in caso di successo sia in caso di errore.
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        // Se il login va a buon fine, reindirizziamo l'utente.
        next: (response) => {
          // SE E' ADMIN !!!
          if (response.user?.role === 'admin') {
            void this.router.navigate(['/admin']);
            return;
          }

          void this.router.navigate(['/films']);
        },
        // Se il backend risponde con errore, mostriamo un messaggio semplice.
        error: () => {
          this.errorMessage = 'Login non riuscito. Controlla i dati inseriti.';
        },
      });
  }
}
