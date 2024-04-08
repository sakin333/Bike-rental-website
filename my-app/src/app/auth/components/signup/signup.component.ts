import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  public hidePassword: boolean = true;
  public reactiveForm!: FormGroup;
  public isInvalid: boolean = false;
  public error: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl(null, [Validators.required]),
    });
  }

  public checkPassword(): void {
    const passwordControl = this.reactiveForm.get('password');
    const confirmPasswordControl = this.reactiveForm.get('confirmPassword');

    if (passwordControl && confirmPasswordControl) {
      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;

      if (password !== confirmPassword) {
        confirmPasswordControl.setErrors({ passwordDidnotMatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  public handleSignUp(): void {
    if (this.reactiveForm.invalid) {
      this.isInvalid = true;
      this.snackbarService.openSnackBar(
        'Form is inavalid',
        'Close',
        'error-snackbar'
      );
    } else {
      const data = {
        email: this.reactiveForm.value['email'],
        username: this.reactiveForm.value['username'],
        password: this.reactiveForm.value['confirmPassword'],
        role:
          this.reactiveForm.value['email'] === 'admin@admin.com' &&
          this.reactiveForm.value['username'] === 'admin'
            ? 'ADMIN'
            : 'CUSTOMER',
      };

      const userObservable = this.authService.signUp(data);
      userObservable.subscribe({
        next: (res: any) => {
          if (res.success) {
            this.snackbarService.openSnackBar(
              'Sign up successful!',
              'Close',
              'success-snackbar'
            );
            this.router.navigateByUrl('login');
            this.reactiveForm.reset();
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

  public togglePasswordVisibility(event: MouseEvent): void {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }
}
