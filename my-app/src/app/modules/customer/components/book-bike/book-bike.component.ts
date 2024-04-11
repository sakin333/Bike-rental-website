import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Bike } from 'src/app/model/Bike';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { default_url } from 'src/app/constants/constant';

@Component({
  selector: 'app-book-bike',
  templateUrl: './book-bike.component.html',
  styleUrls: ['./book-bike.component.css'],
})
export class BookBikeComponent implements OnInit {
  public userId: string = this.authService.getUser()?.id ?? 'No user id found';
  public username: string =
    this.authService.getUser()?.username ?? 'No username found';
  public bikeID: string = this.activatedRoute.snapshot.params['id'];
  public bikeToBeBooked: any;
  public bookingForm!: FormGroup;
  public bookings: any = [];
  public todayDate: Date = new Date();
  public defaultUrl = default_url;

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filterBike();
    this.bookingForm = new FormGroup({
      name: new FormControl(this.username, Validators.required),
      dateFrom: new FormControl(null, [Validators.required]),
      dateTo: new FormControl(null, [Validators.required]),
    });

    this.bookingForm.get('dateFrom')?.valueChanges.subscribe(() => {
      this.dateFromValidator();
      this.dateToValidator();
    });

    this.bookingForm.get('dateTo')?.valueChanges.subscribe(() => {
      this.dateToValidator();
      this.dateFromValidator();
    });
  }

  public dateFromValidator(): void {
    const inputFromDate = this.bookingForm.get('dateFrom')?.value;
    const todayDate = new Date();

    if (inputFromDate instanceof Date && inputFromDate < todayDate) {
      this.bookingForm.get('dateFrom')?.setErrors({ invalidFromDate: true });
    }
  }

  public dateToValidator(): void {
    const inputFromDate = this.bookingForm.get('dateFrom')?.value;
    const inputToDate = this.bookingForm.get('dateTo')?.value;
    if (inputFromDate && inputToDate < inputFromDate) {
      this.bookingForm.get('dateTo')?.setErrors({ invalidToDate: true });
    }
  }

  public filterBike(): void {
    this.customerService.getAllBikes().subscribe({
      next: (res: any) => {
        this.bikeToBeBooked = res.result.find(
          (element: any) => element._id === this.bikeID
        );
      },
    });
  }

  public bookBike(): void {
    const bookingArray = this.bikeToBeBooked.booking;

    const isAlreadyBooked = bookingArray.some((booking: any) => {
      const startTime = new Date(booking.startTime).toISOString();
      const endTime = new Date(booking.endTime).toISOString();

      const inputStartTime = new Date(
        this.bookingForm.get('dateFrom')?.value
      ).toISOString();
      const inputEndTime = new Date(
        this.bookingForm.get('dateTo')?.value
      ).toISOString();

      return (
        (this.bikeToBeBooked._id === this.bikeID &&
          booking.requestId === this.userId &&
          startTime < inputEndTime &&
          endTime > inputStartTime) ||
        (this.bikeToBeBooked._id === this.bikeID &&
          booking.requestId === this.userId &&
          startTime === inputStartTime &&
          endTime === inputEndTime)
      );
    });

    console.log('Already booked', isAlreadyBooked);

    if (isAlreadyBooked) {
      this.snackbar.openSnackBar(
        'You have alrady booked this bike in this time slot',
        'close',
        'error-snackbar'
      );
      return;
    }

    let bookingData = {
      startTime: this.bookingForm.get('dateFrom')?.value,
      endTime: this.bookingForm.get('dateTo')?.value,
      name: this.bookingForm.get('name')?.value,
    };
    // console.log(bookingData, 'sent booking data');
    this.customerService
      .bookBikes(this.userId, this.bikeID, bookingData)
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            localStorage.setItem('bookedBikes', JSON.stringify(res.data));
            this.snackbar.openSnackBar(
              res.message,
              'Close',
              'success-snackbar'
            );
            this.router.navigateByUrl('/customer/dashboard');
            this.bookingForm.reset();
          } else {
            this.snackbar.openSnackBar(res.error, 'Close', 'error-snackbar');
            this.bookingForm.reset();
          }
        },
        error: (err) => {
          this.snackbar.openSnackBar(
            err.error.error,
            'Close',
            'error-snackbar'
          );
        },
      });
  }
}
