import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Bike } from 'src/app/model/Bike';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { bikeBrands, bikeTypes, modelYears } from 'src/app/constants/constant';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';

@Component({
  selector: 'app-update-bike',
  templateUrl: './update-bike.component.html',
  styleUrls: ['./update-bike.component.css'],
})
export class UpdateBikeComponent implements OnInit {
  public bikeID: string = this.activatedRoute.snapshot.params['id'];
  public bikeToBeUpdated: Bike | undefined;
  public updateForm!: FormGroup;
  public bikeBrands = bikeBrands;
  public modelYears = modelYears;
  public types = bikeTypes;

  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private snackbar: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filterBike();
    this.updateForm = new FormGroup({
      bike_brand: new FormControl(null, Validators.required),
      bike_name: new FormControl(null, Validators.required),
      model_year: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
    });
  }

  public filterBike(): void {
    this.adminService.getAllBikes().subscribe({
      next: (res: any) => {
        this.bikeToBeUpdated = res.result.find(
          (element: any) => element._id === this.bikeID
        );
        console.log(this.bikeToBeUpdated);
        this.patchUpdateFormValue();
      },
    });
  }

  private patchUpdateFormValue(): void {
    if (this.bikeToBeUpdated) {
      this.updateForm.patchValue({
        bike_brand: this.bikeToBeUpdated.bike_brand,
        bike_name: this.bikeToBeUpdated.bike_name,
        type: this.bikeToBeUpdated.type,
        description: this.bikeToBeUpdated.description,
        image: this.bikeToBeUpdated.image,
        model_year: this.bikeToBeUpdated.model_year,
        price: this.bikeToBeUpdated.price,
      });
    }
  }

  public onUpdateBike(): void {
    if (this.updateForm.valid) {
      const data = {
        bike_brand: this.updateForm.value['bike_brand'],
        bike_name: this.updateForm.value['bike_name'].toUpperCase(),
        model_year: this.updateForm.value['model_year'],
        type: this.updateForm.value['type'],
        price: this.updateForm.value['price'],
        image: this.updateForm.value['image'],
        description: this.updateForm.value['description'],
      };
      this.adminService.updateBike(this.bikeToBeUpdated?._id, data).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.snackbar.openSnackBar(
              'Bike updated successfully',
              'Close',
              'success-snackbar'
            );
            this.adminService.getAllBikes();
            this.router.navigateByUrl('/admin/dashboard');
          } else {
            this.snackbar.openSnackBar(res.error, 'Close', 'error-snackbar');
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
    } else {
      this.snackbar.openSnackBar('Form Invalid', 'Close', 'error-snackbar');
    }
  }
}
