import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AdminService } from '../../services/admin.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';

@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html',
  styleUrls: ['./get-bookings.component.css'],
})
export class GetBookingsComponent implements OnInit {
  public bookedBikes: any[] = [];
  public isLoading: boolean = false;
  public isBookedBikesAvailable: boolean = false;
  public users: any = [];
  public userId: string = '';

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUser().id;
    this.isLoading = true;
    this.getBookingsDetails();
  }

  public changeBookingStatus(bookingId: string, status: string): void {
    this.bookedBikes.forEach((bookingItem) => {
      if (bookingItem.id === bookingId) {
        const data = {
          name: bookingItem.username,
          startTime: bookingItem.startTime,
          endTime: bookingItem.endTime,
          requestId: bookingItem.requestId,
        };
        this.adminService
          .changeBookingStatus(bookingId, status, data)
          .subscribe({
            next: (res: any) => {
              if (res.success) {
                this.bookedBikes.find((bike) => bike.id === bookingId).status =
                  status;
                this.cdr.detectChanges();
                this.snackbarService.openSnackBar(
                  `Bike ${status}`,
                  'Close',
                  'success-snackbar'
                );
              } else {
                this.bookedBikes.find((bike) => bike.id === bookingId).status =
                  status;
                this.cdr.detectChanges();
                this.snackbarService.openSnackBar(
                  'Approval error',
                  'Close',
                  'error-snackbar'
                );
              }
            },
            error: (err) => {
              this.snackbarService.openSnackBar(
                err.error.error,
                'Close',
                'error-snackbar'
              );
            },
          });
      } else {
        console.log('Bookign Item id not correct');
      }
    });
  }

  public getBookingsDetails(): void {
    this.adminService.getAllBikes().subscribe({
      next: (res: any) => {
        if (res.success) {
          const bikeData = res.result;
          bikeData.forEach((item: any) => {
            if (item?.booking) {
              const bookingData = item.booking;
              bookingData.forEach((bookingItem: any) => {
                this.bookedBikes.push({
                  id: bookingItem._id,
                  username: bookingItem.name,
                  bike_brand: item.bike_brand,
                  bike_name: item.bike_name,
                  startTime: bookingItem.startTime,
                  endTime: bookingItem.endTime,
                  status: bookingItem.status,
                  requestId: bookingItem.requestId,
                });
              });
            } else {
              console.log('No booking data available');
            }
          });
          setTimeout(() => {
            this.isLoading = false;
            this.isBookedBikesAvailable = this.bookedBikes.length > 0;
          }, 2000);
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
}
