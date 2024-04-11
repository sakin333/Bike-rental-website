import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent implements OnInit {
  @Input() maxRating = 5;
  public selectedStar: number = 0;
  public feedbackForm!: FormGroup;
  public formSubmitted: boolean = false;
  public userData = this.authService.getUser();

  constructor(
    private snackbarService: SnackbarService,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<FeedbackComponent>
  ) {}

  ngOnInit(): void {
    this.feedbackForm = new FormGroup({
      rating: new FormControl(null, Validators.required),
      improvement: new FormControl('', Validators.required),
      email: new FormControl(null, Validators.email),
    });
  }

  public handleMouseEnter(index: number): void {
    this.selectedStar = index + 1;
  }

  public rating(index: number): void {
    this.selectedStar = index + 1;
    this.feedbackForm.controls['rating'].setValue(this.selectedStar);
    // console.log('selected star', this.selectedStar);
  }

  public onFeedbackSubmit() {
    this.formSubmitted = true;
    if (this.feedbackForm.valid) {
      // console.log('feedbaack form', this.feedbackForm);
      const data = {
        rating: this.feedbackForm.value['rating'],
        improvement: this.feedbackForm.value['improvement'],
        email: this.feedbackForm.value['email'],
        user: this.userData,
      };

      const feedbackObservable = this.customerService.postFeedback(data);
      feedbackObservable.subscribe({
        next: (res: any) => {
          if (res.success) {
            this.snackbarService.openSnackBar(
              'Thank you for your feedback',
              'Close',
              'success-snackbar'
            );
            this.dialogRef.close();
            this.router.navigateByUrl('/customer/dashboard');
            this.feedbackForm.reset();
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
    }
  }
}
