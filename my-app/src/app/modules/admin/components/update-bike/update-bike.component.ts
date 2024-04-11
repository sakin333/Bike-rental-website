import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Bike } from 'src/app/model/Bike';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  bikeBrands,
  bikeTypes,
  default_url,
  modelYears,
} from 'src/app/constants/constant';
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
  public selectedFileName: string = '';
  public defaultUrl = default_url;
  public fileImage: string | undefined = '';

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
      image: new FormControl(null),
      description: new FormControl(null, Validators.required),
    });
  }

  public filterBike(): void {
    this.adminService.getAllBikes().subscribe({
      next: (res: any) => {
        this.bikeToBeUpdated = res.result.find(
          (element: any) => element._id === this.bikeID
        );
        // console.log(this.bikeToBeUpdated);
        this.patchUpdateFormValue();
      },
    });
  }

  private patchUpdateFormValue(): void {
    if (this.bikeToBeUpdated) {
      const imageName = this.bikeToBeUpdated.image.split('-')[1];
      this.selectedFileName = imageName;
      this.updateForm.patchValue({
        bike_brand: this.bikeToBeUpdated.bike_brand,
        bike_name: this.bikeToBeUpdated.bike_name,
        type: this.bikeToBeUpdated.type,
        description: this.bikeToBeUpdated.description,
        model_year: this.bikeToBeUpdated.model_year,
        price: this.bikeToBeUpdated.price,
        image: this.bikeToBeUpdated.image,
      });
    }
  }

  public onUpdateBike(): void {
    if (this.updateForm.valid) {
      // const data = {
      //   bike_brand: this.updateForm.value['bike_brand'],
      //   bike_name: this.updateForm.value['bike_name'].toUpperCase(),
      //   model_year: this.updateForm.value['model_year'],
      //   type: this.updateForm.value['type'],
      //   price: this.updateForm.value['price'],
      //   image: this.updateForm.value['image'],
      //   description: this.updateForm.value['description'],
      // };

      const formData = new FormData();
      formData.append('bike_brand', this.updateForm.get('bike_brand')!.value);
      formData.append(
        'bike_name',
        this.updateForm.get('bike_name')!.value.toUpperCase()
      );
      formData.append('model_year', this.updateForm.get('model_year')!.value);
      formData.append('type', this.updateForm.get('type')!.value);
      formData.append('price', this.updateForm.get('price')!.value);
      formData.append('image', this.updateForm.get('image')!.value);
      formData.append('description', this.updateForm.get('description')!.value);
      this.adminService
        .updateBike(this.bikeToBeUpdated?._id, formData)
        .subscribe({
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

  public handleFileUpload(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFileName = file.name;
      this.updateForm.patchValue({
        image: file,
      });
    } else {
      this.updateForm.patchValue({
        image: this.bikeToBeUpdated?.image,
      });
    }
  }
}
