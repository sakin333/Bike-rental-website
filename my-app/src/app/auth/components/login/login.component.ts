import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public hidePassword: boolean = true;
  public loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  public handleLogin(): void {
    if (this.loginForm.value['email'] && this.loginForm.value['password']) {
      const credentials = {
        email: this.loginForm.value['email'],
        password: this.loginForm.value['password'],
      };
      this.authService.logIn(credentials).subscribe({
        next: (res: any) => {
          if (res.success) {
            const USERDETAILS = {
              id: res.result.data._id,
              username: res.result.data.username,
              email: res.result.data.email,
              role: res.result.data.role,
            };
            const TOKEN = res.result.token;
            localStorage.setItem('user', JSON.stringify(USERDETAILS));
            localStorage.setItem('token', TOKEN);
            if (this.authService.isAdmin()) {
              this.snackbarService.openSnackBar(
                'Welcome admin',
                'Close',
                'success-snackbar'
              );
              this.router.navigateByUrl('/admin/dashboard');
            } else {
              this.snackbarService.openSnackBar(
                `Welcome ${USERDETAILS.username}`,
                'Close',
                'success-snackbar'
              );
              this.router.navigateByUrl('/customer/dashboard');
            }
          } else {
            this.snackbarService.openSnackBar(
              res.error,
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
      this.snackbarService.openSnackBar(
        'Enter all required fields',
        'Close',
        'error-snackbar'
      );
    }
  }

  public togglePasswordVisibility(event: MouseEvent): void {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }
}
