import { Component, OnInit } from '@angular/core';
import { GenreService } from '../../../services/genre.service';
import { Genre } from '../../../models/genre';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    selector: 'app-admin-genre',
    templateUrl: './admin-genre.component.html',
    styleUrls: ['./admin-genre.component.css']
})
export class AdminGenreComponent implements OnInit {

    genres: any = [];

    newGenre: any = {
        name: ''
    };

    constructor(private genreService: GenreService) { }

    ngOnInit(): void {
        this.loadGenres();
    }

    loadGenres() {
        this.genreService.getAllGenres().subscribe({
            next: (data) => {
                this.genres = data;
            },
            error: (err) => console.error(err)
        });
    }

    createGenre() {
        if (!this.newGenre.name.trim()) return;

        this.genreService.createGenre(this.newGenre).subscribe({
            next: () => {
                this.newGenre = { name: '' };
                this.loadGenres();
            },
            error: (err) => console.error(err)
        });
    }

    deleteGenre(id?: number) {
        if (!id) return;

        this.genreService.deleteGenre(id).subscribe({
            next: () => this.loadGenres(),
            error: (err) => console.error(err)
        });
    }

}