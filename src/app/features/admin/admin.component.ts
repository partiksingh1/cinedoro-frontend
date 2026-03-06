import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    standalone: true,
    selector: 'app-admin',
    imports: [CommonModule, RouterModule],
    templateUrl: './admin.component.html'
})


export class AdminComponent {
}
