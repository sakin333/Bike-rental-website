import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { bikeBrands, bikeTypes, modelYears } from 'src/app/constants/constant';

@Component({
  selector: 'app-bike',
  templateUrl: './bike.component.html',
  styleUrls: ['./bike.component.css']
})
export class BikeComponent {
  isInvalid = false
  bikeForm!: FormGroup
  bikeBrands = bikeBrands
  modelYears = modelYears
  types = bikeTypes

  constructor(private snackbar: MatSnackBar, private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.bikeForm = new FormGroup({
      bike_brand: new FormControl(null, Validators.required),
      bike_name: new FormControl(null, Validators.required),
      model_year: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required)
    })
  }

  openSnackBar(message: string, action: string, panelClass: string, duration: number = 3000) {
    this.snackbar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      panelClass: panelClass
    });
  }

  onAddBike() {
    console.log("Clicked add bike")
    if(this.bikeForm.invalid) {
      console.log(this.bikeForm)
      this.isInvalid = true
      this.openSnackBar("Form is inavalid", "Close", "error-snackbar")
    }else {
      console.log("inside")
      const data = {
        bike_brand: this.bikeForm.value['bike_brand'],
        bike_name: this.bikeForm.value['bike_name'].toUpperCase(),
        model_year: this.bikeForm.value['model_year'],
        type: this.bikeForm.value['type'],
        price: this.bikeForm.value['price'],
        image: this.bikeForm.value['image'],
        description: this.bikeForm.value['description'],
      }

      const bikeObservable = this.adminService.addBike(data)
      bikeObservable.subscribe({
        next: (res: any) => {
          if(res.success) {
            this.openSnackBar('Bike added successfully!', 'Close', 'success-snackbar');
            this.router.navigateByUrl('/admin/dashboard')
            this.bikeForm.reset()
          }else {
            this.openSnackBar(res.error, 'Close', 'error-snackbar');
          }
        },
        error: (err) => {
          console.log("inside error")
          this.openSnackBar(err.error.error, 'Close', 'error-snackbar');
        }
      })
    }
  }
}
