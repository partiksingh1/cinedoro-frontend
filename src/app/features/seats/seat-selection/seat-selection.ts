import { Component, OnInit } from '@angular/core'
import { SeatService } from '../../../services/seat.service'
import { TicketService } from '../../../services/ticket.service'
import { Seat } from '../../../models/seat'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { BookingService } from '../../../services/booking.service'
import { ScreeningService } from '../../../services/screening.service'
import { UserService } from '../../../services/user.service'
import { Screening } from '../../../models/screening'
import { forkJoin, switchMap, map, tap } from 'rxjs'

@Component({
  imports: [CommonModule],
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.html',
  styleUrls: ['./seat-selection.css']
})
export class SeatSelectionComponent implements OnInit {

  seats: Seat[] = []
  seatMatrix: Seat[][] = []

  occupiedSeats: number[] = []
  selectedSeats: number[] = []

  screening: Screening | null = null
  screeningId!: number
  loading = false
  errorMessage = ''

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private seatService: SeatService,
    private ticketService: TicketService,
    private bookingService: BookingService,
    private screeningService: ScreeningService,
    private userService: UserService
  ) { }

  ngOnInit() {
    // Validate user is logged in
    if (!this.userService.isLoggedIn()) {
      alert('Please log in to continue');
      this.router.navigate(['/login']);
      return;
    }

    this.screeningId = Number(this.route.snapshot.paramMap.get('screeningId'))

    // Load screening data, then seats and occupied seats
    this.screeningService.getScreeningById(this.screeningId).subscribe({
      next: screening => {
        this.screening = screening
        this.loadSeats()
        this.loadOccupiedSeats()
      },
      error: err => {
        this.errorMessage = 'Failed to load screening information'
        console.error('Error loading screening', err)
      }
    })
  }

  bookSeats() {
    if (!this.screening) {
      alert('Screening information not loaded')
      return;
    }

    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat')
      return;
    }

    // Get current user ID
    const userId = this.getCurrentUserId()
    if (!userId) {
      alert('Please log in to complete the booking')
      this.router.navigate(['/login'])
      return;
    }

    const totalPrice = this.selectedSeats.length * this.screening.basePrice

    const bookingRequest = {
      userId: userId,
      screeningId: this.screeningId,
      totalPrice: totalPrice
    }

    this.loading = true
    this.errorMessage = ''

    this.bookingService.createBooking(bookingRequest).pipe(

      switchMap(booking => {

        const ticketRequests = this.selectedSeats.map(seatId => {

          const ticketRequest = {
            bookingId: booking.id,
            screeningId: this.screeningId,
            seatId: seatId,
            price: this.screening!.basePrice
          }

          return this.ticketService.createTicket(ticketRequest)

        })

        return forkJoin(ticketRequests).pipe(
          map(() => booking.id)
        )

      }),

      tap(bookingId => {
        this.loading = false
        this.router.navigate(['/ticket', bookingId])
      })

    ).subscribe({
      error: err => {
        this.loading = false
        this.errorMessage = 'Failed to complete booking. Please try again.'
        console.error('Booking error:', err)
      }
    })

  }

  loadSeats() {
    if (!this.screening) return;

    this.seatService.getSeatsByHall(this.screening.hallId)
      .subscribe({
        next: seats => {
          this.seats = seats
          this.buildSeatMatrix()
        },
        error: err => {
          this.errorMessage = 'Failed to load seat information'
          console.error('Error loading seats', err)
        }
      })

  }

  loadOccupiedSeats() {

    this.ticketService.getOccupiedSeats(this.screeningId)
      .subscribe({
        next: data => {
          this.occupiedSeats = data
        },
        error: err => {
          this.errorMessage = 'Failed to load seat availability'
          console.error('Error loading occupied seats', err)
        }
      })

  }

  buildSeatMatrix() {

    const rows: { [key: number]: Seat[] } = {}

    this.seats.forEach(seat => {

      if (!rows[seat.rowNumber]) {
        rows[seat.rowNumber] = []
      }

      rows[seat.rowNumber].push(seat)

    })

    this.seatMatrix = Object.values(rows).map(row =>
      row.sort((a, b) => a.seatNumber - b.seatNumber)
    )

  }

  selectSeat(seat: Seat) {

    if (this.isOccupied(seat.id)) return

    if (this.selectedSeats.includes(seat.id)) {
      this.selectedSeats = this.selectedSeats.filter(id => id !== seat.id)
    } else {
      this.selectedSeats.push(seat.id)
    }

  }

  isOccupied(seatId: number) {
    return this.occupiedSeats.includes(seatId)
  }

  isSelected(seatId: number) {
    return this.selectedSeats.includes(seatId)
  }

  private getCurrentUserId(): number | null {
    const userIdStr = sessionStorage.getItem('userId') || localStorage.getItem('userId')
    if (userIdStr) {
      return parseInt(userIdStr, 10)
    }
    return null
  }

}