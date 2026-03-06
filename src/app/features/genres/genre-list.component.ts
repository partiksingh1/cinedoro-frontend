import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    standalone: true,
    selector: 'app-genre-list',
    imports: [CommonModule, RouterModule],
    templateUrl: './genre-list.component.html'
})


export class GenreListComponent {
}
