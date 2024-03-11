import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Bike } from 'src/app/model/Bike';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';

@Component({
  selector: 'app-book-bike',
  templateUrl: './book-bike.component.html',
  styleUrls: ['./book-bike.component.css'],
})
export class BookBikeComponent implements OnInit {
  userId = this.authService.getUser().id
  username = this.authService.getUser().username
  bikeID: string = this.activatedRoute.snapshot.params['id'];
  bikeToBeBooked: Bike | undefined;
  bookingForm!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('hereeeeeeeeeeeeeee',this.userId, this.username)
    this.filterBike();
    this.bookingForm = new FormGroup({
      name: new FormControl(this.username, Validators.required),
      dateFrom: new FormControl(null, [Validators.required]),
      dateTo: new FormControl(null, [Validators.required]),
    });

    this.bookingForm.get('dateFrom')?.valueChanges.subscribe(() => {
      this.dateFromValidator()
    })

    this.bookingForm.get('dateTo')?.valueChanges.subscribe(() => {
      this.dateToValidator()
    })
  }

  dateFromValidator() {
    const inputFromDate = this.bookingForm.get('dateFrom')?.value;
    const todayDate = new Date();

    if (inputFromDate instanceof Date && inputFromDate < todayDate ) {
      this.bookingForm.get('dateFrom')?.setErrors({ invalidFromDate: true })
    }
  }

  dateToValidator() {
    const inputFromDate = this.bookingForm.get('dateFrom')?.value;
    const inputToDate = this.bookingForm.get('dateTo')?.value;
    if (inputFromDate && inputToDate <= inputFromDate) {
      this.bookingForm.get('dateTo')?.setErrors({ invalidToDate: true })
    }
  }

  filterBike() {
    this.customerService.getAllBikes().subscribe({
      next: (res: any) => {
        this.bikeToBeBooked = res.result.find(
          (element: any) => element._id === this.bikeID
        );
        console.log('from cust', this.bikeToBeBooked);
      },
    });
  }

  bookBike() {
    console.log('booked clicked', this.bookingForm);
    let bookingData = {
      startTime: this.bookingForm.get('dateFrom')?.value,
      endTime: this.bookingForm.get('dateTo')?.value,
    }
    this.customerService.bookBikes(this.userId, this.bikeID, bookingData).subscribe(({
      next: (res: any) => {
        if(res.success) {
          console.log("hereeeeeeeee",res)
          localStorage.setItem("bookedBikes", JSON.stringify(res.data))
          this.snackbar.openSnackBar(res.message, "Close", "success-snackbar")
          this.router.navigateByUrl('/customer/dashboard')
          this.bookingForm.reset()
        }else {
          this.snackbar.openSnackBar(res.error, "Close", "error-snackbar")
          this.bookingForm.reset()
        }
      },
      error: (err) => {
        this.snackbar.openSnackBar(err.error.error, "Close", "error-snackbar")
      }
    }))
  }
}
