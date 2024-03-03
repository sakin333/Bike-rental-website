import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  hidePassword: boolean = true
  reactiveForm!: FormGroup
  isInvalid = false
  error = false

  // constructor(private formBuilder: FormBuilder){}

  // ngOnInit(): void {
  //   this.reactiveForm = this.formBuilder.group({
  //     email: ['', [Validators.required, Validators.email]],
  //     username: ['', Validators.required],
  //     password: ['', [Validators.required, Validators.minLength(6)]],
  //     confirmPassword: ['', [Validators.required]]
  //   })
  // }

  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar) {}


  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required])
    })
  }

  openSnackBar(message: string, action: string, panelClass: string, duration: number = 3000) {
    this.snackbar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      panelClass: panelClass
    });
  }

  checkPassword() {
    const passwordControl = this.reactiveForm.get('password');
    const confirmPasswordControl = this.reactiveForm.get('confirmPassword');

    if(passwordControl && confirmPasswordControl) {
      const password = passwordControl.value
      const confirmPassword = confirmPasswordControl.value

      if(password !== confirmPassword) {
        confirmPasswordControl.setErrors({ 'passwordDidnotMatch': true})
      }else {
        confirmPasswordControl.setErrors(null)
      }
    }
  }


  handleSignUp() {
    if(this.reactiveForm.invalid) {
      this.isInvalid = true
      this.openSnackBar("Form is inavalid", "Close", "error-snackbar")
    }else {
      const data = {
        email: this.reactiveForm.value['email'],
        username: this.reactiveForm.value['username'],
        password: this.reactiveForm.value['confirmPassword'],
        role: (this.reactiveForm.value['email'] === "admin@admin.com" && this.reactiveForm.value['username'] === "admin") ? "ADMIN" : "CUSTOMER"
      }

      const userObservable = this.authService.signUp(data)
      userObservable.subscribe({
        next: (res: any) => {
          if(res.success) {
            // console.log(res.success)
            this.openSnackBar('Sign up successful!', 'Close', 'success-snackbar');
            this.router.navigateByUrl('login')
            this.reactiveForm.reset()
          }
        },
        error: (err) => {
          // console.log('here',err)
          this.openSnackBar(err.error.error, 'Close', 'error-snackbar');
        }
      })

    }

  }

  togglePasswordVisibility(event: MouseEvent){
    event.preventDefault()
    this.hidePassword = !this.hidePassword
  }
}
