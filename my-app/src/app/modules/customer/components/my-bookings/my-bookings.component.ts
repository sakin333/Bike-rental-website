import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { Bike } from 'src/app/model/Bike';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { Router } from '@angular/router';
import { default_url } from 'src/app/constants/constant';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
})
export class MyBookingsComponent implements OnInit {
  public userId: string = '';
  public bookedBikes: any[] = [];
  public isLoading: boolean = false;
  public isBookedBikesAvailable: boolean = false;
  public defaultUrl = default_url;

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUser()?.id ?? 'No user id found';
    this.isLoading = true;
    this.getBookingsDetails();
  }

  public getBookingsDetails(): void {
    this.customerService.getAllBikes().subscribe({
      next: (res: any) => {
        if (res.success) {
          const bikeData = res.result;
          bikeData.forEach((item: any) => {
            if (item?.booking) {
              const bookingData = item.booking;
              bookingData.forEach((bookingItem: any) => {
                if (bookingItem.requestId === this.userId) {
                  this.bookedBikes.push({
                    id: bookingItem._id,
                    username: bookingItem.name,
                    bike_brand: item.bike_brand,
                    bike_name: item.bike_name,
                    image: item.image,
                    startTime: bookingItem.startTime,
                    endTime: bookingItem.endTime,
                    status: bookingItem.status,
                    accepted: bookingItem.accepted,
                  });
                } else {
                  console.log('No booking details available');
                }
              });
              setTimeout(() => {
                this.isLoading = false;
                this.isBookedBikesAvailable = this.bookedBikes.length > 0;
                // console.log("reerererererer", this.bookedBikes)
              }, 2000);
            } else {
              console.log('No booking data available');
            }
          });
        } else {
          console.log('Error occured while fetching data');
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.log('Error occured', err);
        this.isLoading = false;
      },
    });
  }

  public cancelBooking(id: string | null): void {
    this.customerService.cancelBooking(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.snackbarService.openSnackBar(
            res.message,
            'Close',
            'success-snackbar'
          );

          this.bookedBikes = this.bookedBikes.filter(
            (booking) => booking.id !== id
          );
          this.isBookedBikesAvailable = this.bookedBikes.length > 0;
        }
      },
      error: (err) => {
        console.log('Error', err.error);
      },
    });
  }
}
