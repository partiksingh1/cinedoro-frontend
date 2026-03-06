import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    standalone: true,
    selector: 'app-actors-list',
    imports: [CommonModule, RouterModule],
    templateUrl: './actor-list.component.html'
})


export class ActorListComponent {
}
