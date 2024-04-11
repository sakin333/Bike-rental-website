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
  public imageFile: any;

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
      const formData = new FormData();
      formData.append('bike_brand', this.bikeForm.get('bike_brand')!.value);
      formData.append(
        'bike_name',
        this.bikeForm.get('bike_name')!.value.toUpperCase()
      );
      formData.append('model_year', this.bikeForm.get('model_year')!.value);
      formData.append('type', this.bikeForm.get('type')!.value);
      formData.append('price', this.bikeForm.get('price')!.value);
      formData.append('image', this.bikeForm.get('image')!.value);
      formData.append('description', this.bikeForm.get('description')!.value);

      const bikeObservable = this.adminService.addBike(formData);
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

  public handleFileUpload(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.bikeForm.patchValue({
        image: file,
      });
    }
  }
}
