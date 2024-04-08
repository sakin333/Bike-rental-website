import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { bikeBrands, bikeTypes, modelYears } from 'src/app/constants/constant';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';

@Component({
  selector: 'app-bike',
  templateUrl: './bike.component.html',
  styleUrls: ['./bike.component.css'],
})
export class BikeComponent {
  public isInvalid = false;
  public bikeForm!: FormGroup;
  public bikeBrands = bikeBrands;
  public modelYears = modelYears;
  public types = bikeTypes;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.bikeForm = new FormGroup({
      bike_brand: new FormControl(null, Validators.required),
      bike_name: new FormControl(null, Validators.required),
      model_year: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
    });
  }

  public onAddBike(): void {
    if (this.bikeForm.invalid) {
      this.isInvalid = true;
      this.snackbarService.openSnackBar(
        'Form is inavalid',
        'Close',
        'error-snackbar'
      );
    } else {
      const data = {
        bike_brand: this.bikeForm.value['bike_brand'],
        bike_name: this.bikeForm.value['bike_name'].toUpperCase(),
        model_year: this.bikeForm.value['model_year'],
        type: this.bikeForm.value['type'],
        price: this.bikeForm.value['price'],
        image: this.bikeForm.value['image'],
        description: this.bikeForm.value['description'],
      };

      const bikeObservable = this.adminService.addBike(data);
      bikeObservable.subscribe({
        next: (res: any) => {
          if (res.success) {
            this.snackbarService.openSnackBar(
              'Bike added successfully!',
              'Close',
              'success-snackbar'
            );
            this.router.navigateByUrl('/admin/dashboard');
            this.bikeForm.reset();
          } else {
            this.snackbarService.openSnackBar(
              res.error,
              'Close',
              'error-snackbar'
            );
          }
        },
        error: (err) => {
          console.log('inside error');
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
