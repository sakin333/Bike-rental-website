import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hidePassword: boolean = true
  loginForm!: FormGroup

  constructor(private authService: AuthService, private snackbar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    })
  }

  openSnackBar(message: string, action: string, panelClass: string, duration: number = 3000) {
    this.snackbar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      panelClass: panelClass
    });
  }

  handleLogin() {
    if(this.loginForm.value['email'] && this.loginForm.value['password']) {
      const credentials = {
        email: this.loginForm.value['email'],
        password: this.loginForm.value['password']
      }
      this.authService.logIn(credentials).subscribe({
        next: (res: any) => {
          // console.log('here',res)
          const USERDETAILS = {
            username: res.result.data.username,
            email: res.result.data.email,
            role: res.result.data.role
          }
          const TOKEN = res.result.token
          localStorage.setItem("user", JSON.stringify(USERDETAILS))
          localStorage.setItem("token", TOKEN)
          if(this.authService.isAdmin()) {
            this.openSnackBar("Welcome admin", "Close", "success-snackbar")
            this.router.navigateByUrl('/admin/dashboard')
          }else {
            this.openSnackBar(`Welcome ${USERDETAILS.username}`, "Close", "success-snackbar")
            this.router.navigateByUrl('/customer/dashboard')
          }
        },
        error: (err) => {
          this.openSnackBar(err.error.error, "Close", "error-snackbar")
        }
      })
    }else {
      this.openSnackBar("Enter all required fields", "Close", "error-snackbar")
    }
  }

  togglePasswordVisibility(event: MouseEvent){
    event.preventDefault()
    this.hidePassword = !this.hidePassword
  }
}
