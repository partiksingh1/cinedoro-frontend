import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BookingService } from '../../services/booking.service'
import { TicketService } from '../../services/ticket.service'
import { Ticket } from '../../services/ticket.service'
import { CommonModule } from '@angular/common'
import { Observable } from 'rxjs'

interface TicketViewModel {
  bookingId: number;
  totalPrice: number;
  tickets: Ticket[];
  seatNumbers: string;
}

@Component({
  selector: 'app-ticket',
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TicketComponent implements OnInit {

  bookingId!: number
  ticketData$!: Observable<TicketViewModel>
  loading = true
  errorMessage = ''

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private ticketService: TicketService
  ) { }

  ngOnInit() {
    this.bookingId =
      Number(this.route.snapshot.paramMap.get('bookingId'))

    if (!this.bookingId) {
      this.errorMessage = 'Invalid booking ID'
      return
    }

    // Load booking and tickets
    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: booking => {
        this.ticketService.getTicketsByBooking(this.bookingId).subscribe({
          next: tickets => {
            const seatNumbers = tickets.map(t => `Seat ${t.seatId}`).join(', ')
            this.ticketData$ = new Observable(observer => {
              observer.next({
                bookingId: booking.id,
                totalPrice: booking.totalPrice,
                tickets: tickets,
                seatNumbers: seatNumbers
              })
              observer.complete()
            })
            this.loading = false
          },
          error: err => {
            this.errorMessage = 'Failed to load ticket information'
            this.loading = false
            console.error('Error loading tickets', err)
          }
        })
      },
      error: err => {
        this.errorMessage = 'Failed to load booking information'
        this.loading = false
        console.error('Error loading booking', err)
      }
    })
  }

  downloadTickets() {
    // In a real app, this would generate a PDF or similar
    alert('Download ticket functionality would be implemented here')
  }

  printTickets() {
    window.print()
  }

  goHome() {
    this.router.navigate(['/film'])
  }

}