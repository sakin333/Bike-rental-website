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
  userId: string = '';
  bookedBikes: any[] = [];
  isLoading: boolean = false;
  isBookedBikesAvailable: boolean = false;

  constructor(
    private authService: AuthService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUser().id;
    this.isLoading = true;
    this.customerService.getAllBikes().subscribe({
      next: (res: any) => {
        if (res.success) {
          const data = res.result;
          this.bookedBikes = data
            .filter((item: any) =>
              item.booking.some(
                (bookingItem: any) => bookingItem.requestId === this.userId
              )
            )
            .map((item: any) => {
              const bookingData = item.booking.find(
                (bookingItem: any) => bookingItem.requestId === this.userId
              );
              return {
                bike_brand: item.bike_brand,
                bike_name: item.bike_name,
                startTime: bookingData.startTime,
                endTime: bookingData.endTime,
                status: bookingData.status,
              };
            });
          setTimeout(() => {
            this.isLoading = false;
            this.isBookedBikesAvailable = this.bookedBikes.length > 0;
          }, 1000);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
