import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/navbar/navbar";
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  showSplash = false;
  fadeOut = false;

  constructor(private cdr: ChangeDetectorRef) {

    const splashShown = sessionStorage.getItem('splashShown');

    if (!splashShown) {

      this.showSplash = true;

      setTimeout(() => {
        this.fadeOut = true;
        this.cdr.detectChanges();
      }, 2600);

      setTimeout(() => {
        this.showSplash = false;
        sessionStorage.setItem('splashShown', 'true');
        this.cdr.detectChanges();
      }, 3400);

    }

  }
}