import { Component } from '@angular/core'
import { ScreeningService } from '../../../services/screening.service'
import { Screening } from '../../../models/screening'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-screening-by-date',
  templateUrl: './screening-by-date.html',
  imports: [FormsModule, CommonModule]
})
export class ScreeningByDateComponent {

  date!: string
  screenings: Screening[] = []

  constructor(private screeningService: ScreeningService) { }

  search(): void {

    this.screeningService.getScreeningsByDate(this.date)
      .subscribe(data => {
        this.screenings = data
      })

  }

}