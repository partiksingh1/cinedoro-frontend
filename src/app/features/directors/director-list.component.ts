import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    standalone: true,
    selector: 'app-director-list',
    imports: [CommonModule, RouterModule],
    templateUrl: './director-list.component.html'
})


export class DirectorListComponent {
}
