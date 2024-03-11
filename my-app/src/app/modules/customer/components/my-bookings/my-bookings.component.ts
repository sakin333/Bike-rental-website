import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { Bike } from 'src/app/model/Bike';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
})
export class MyBookingsComponent implements OnInit {
  userId = this.authService.getUser().id;
  bookedBikes: Bike[] = []
  bookedBikesAvailable: boolean = false

  constructor(
    private authService: AuthService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    console.log("bikeeee", this.getMyBookings())
      this.customerService.getAllBikes().subscribe({
        next: (res: any) => {
          if(res.success) {
            res.result.map((item: any) => {
              if(item.booking) {
                this.bookedBikesAvailable = true
                this.bookedBikes.push(item)
                console.log("boolean",this.bookedBikesAvailable)

                console.log("my bikes", this.bookedBikes)
              }else {
                this.bookedBikesAvailable = false
              }
            })
          }
        },
        error: (err) => {
          console.log("Error: ",err.error.error)
        }
      })
  }

  getMyBookings() {
    const bikeJson = localStorage.getItem("bookedBikes")
    if(bikeJson) {
      return  JSON.parse(bikeJson)
    }
  }
}
