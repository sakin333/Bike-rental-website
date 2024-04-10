import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import {
  bikeBrands,
  modelYears,
  bikeTypes,
  default_url,
} from 'src/app/constants/constant';
import { AdminService } from '../../services/admin.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';

@Component({
  selector: 'app-search-bike',
  templateUrl: './search-bike.component.html',
  styleUrls: ['./search-bike.component.css'],
})
export class SearchBikeComponent {
  public searchForm!: FormGroup;
  public bikeBrands = bikeBrands;
  public modelYears = modelYears;
  public types = bikeTypes;
  public allBikes: any = [];
  public searchedBikeAvailable: boolean = false;
  public searchClicked: boolean = false;
  public defaultUrl = default_url;
  public isOptionShown: boolean = false;

  constructor(
    private adminService: AdminService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      bike_brand: new FormControl(null),
      bike_name: new FormControl(null, Validators.required),
      model_year: new FormControl(null),
      type: new FormControl(null),
      price: new FormControl(null),
      minValue: new FormControl(null),
      maxValue: new FormControl(null),
    });
  }

  public toggleOptions(event: Event) {
    event.preventDefault();
    this.isOptionShown = !this.isOptionShown;
  }

  public onSearchBike(): void {
    this.searchClicked = true;
    this.adminService.getAllBikes().subscribe({
      next: (res: any) => {
        const data = res.result;
        const { bike_brand, bike_name, model_year, type, minValue, maxValue } =
          this.searchForm.value;

        this.allBikes = data.filter((item: any) => {
          if (bike_brand && item.bike_brand !== bike_brand) {
            return false;
          }

          if (
            bike_name &&
            !item.bike_name.toLowerCase().includes(bike_name.toLowerCase())
          ) {
            return false;
          }

          if (model_year && item.model_year !== model_year) {
            return false;
          }

          if (type && item.type !== type) {
            return false;
          }

          if (minValue && !(item.price >= minValue)) {
            return false;
          }

          if (maxValue && !(item.price <= maxValue)) {
            return false;
          }

          return true;
        });

        this.searchedBikeAvailable = this.allBikes.length > 0;
        this.isOptionShown = false;
      },
      error: (err) => {
        this.snackbar.openSnackBar(err.error, 'Close', 'error-snackbar');
      },
    });
  }

  public deleteBike(id: string): void {
    this.adminService.deleteBike(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.getAllBikes();
          this.snackbar.openSnackBar(res.message, 'Close', 'success-snackbar');
        } else {
          this.snackbar.openSnackBar(res.error, 'Close', 'error-snackbar');
        }
      },
      error: (err) => {
        this.snackbar.openSnackBar(err.error.error, 'Close', 'error-snackbar');
      },
    });
  }

  public getAllBikes(): void {
    this.adminService.getAllBikes().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.allBikes = res.result;
        } else {
          this.snackbar.openSnackBar(res.error, 'Close', 'error-snackbar');
        }
      },
      error: (err) => {
        this.snackbar.openSnackBar(err.error.error, 'Close', 'error-snackbar');
      },
    });
  }

  public deleteBikeFromSearch(id: string): void {
    this.adminService.deleteBike(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.snackbar.openSnackBar(res.message, 'Close', 'success-snackbar');
        } else {
          this.snackbar.openSnackBar(res.error, 'Close', 'error-snackbar');
        }
      },
      error: (err) => {
        this.snackbar.openSnackBar(err.error.error, 'Close', 'error-snackbar');
      },
    });
  }
}
