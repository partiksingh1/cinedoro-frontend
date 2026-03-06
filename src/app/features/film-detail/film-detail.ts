import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { FilmService } from '../../services/film.service'
import { Film } from '../../models/film'
import { CommonModule } from '@angular/common'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-film-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './film-detail.html',
  styleUrl: './film-detail.css'
})
export class FilmDetail implements OnInit {

  film$!: Observable<Film>
  filmId!: number

  constructor(
    private route: ActivatedRoute,
    private filmService: FilmService
  ) { }

  ngOnInit(): void {
    this.filmId = Number(this.route.snapshot.paramMap.get('filmId'))
    this.film$ = this.filmService.getFilmById(this.filmId)
  }

  groupScreeningsByDate(screenings: any[]) {
    const grouped: any = {}

    screenings.forEach(s => {
      if (!grouped[s.screeningDate]) {
        grouped[s.screeningDate] = []
      }
      grouped[s.screeningDate].push(s)
    })

    return grouped
  }

}