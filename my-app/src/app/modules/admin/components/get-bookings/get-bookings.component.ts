import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AdminService } from '../../services/admin.service';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html',
  styleUrls: ['./get-bookings.component.css'],
})
export class GetBookingsComponent implements OnInit {
  bookedBikes: any[] = [];
  isLoading: boolean = false;
  users: any = []
  userId: string = ''

  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUser().id
    this.isLoading = true;
    this.getUsersAndBookings()
  }

  changeBookingStatus(bookingId: string, status: string) {
    console.log(bookingId, status)
  }

  getUsersAndBookings() {
    this.adminService.getAllBikes().subscribe({
      next: (res: any) => {
        if(res.success) {
          const data = res.result
          this.adminService.getUsers().subscribe({
            next: (userRes: any) => {
              if(userRes.success) {
                const users = userRes.result.filter((user: any) => user.role === "CUSTOMER")
                data.forEach((item: any) => {
                  item.booking.forEach((bookingItem: any) => {
                    const user = users.find((u: any) => u._id === bookingItem.requestId)
                    const username = user ? user.username : "Unknown"

                    this.bookedBikes.push({
                      id: bookingItem._id,
                      username: username,
                      bike_brand: item.bike_brand,
                      bike_name: item.bike_name,
                      startTime: bookingItem.startTime,
                      endTime: bookingItem.endTime,
                      status: bookingItem.status,
                    })
                  })
                })
                this.isLoading = false
              }
            },
            error: (err) => {
              console.log("Error occured",err)
              this.isLoading = false
            }
          })
        }
      },
      error: (err) => {
        console.log("Error occured",err)
        this.isLoading = false
      }
    })
  }
}
