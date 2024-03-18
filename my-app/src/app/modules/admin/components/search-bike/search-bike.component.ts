import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { bikeBrands, modelYears, bikeTypes } from 'src/app/constants/constant';
import { AdminService } from '../../services/admin.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';

@Component({
  selector: 'app-search-bike',
  templateUrl: './search-bike.component.html',
  styleUrls: ['./search-bike.component.css'],
})
export class SearchBikeComponent {
  searchForm!: FormGroup;
  bikeBrands = bikeBrands;
  modelYears = modelYears;
  types = bikeTypes;
  allBikes: any = [];
  searchedBikeAvailable: boolean = false;
  searchClicked: boolean = false;

  constructor(
    private adminService: AdminService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      bike_brand: new FormControl(null),
      bike_name: new FormControl(null),
      model_year: new FormControl(null),
      type: new FormControl(null),
      price: new FormControl(null),
    });
  }

  onSearchBike() {
    this.searchClicked = true;
    this.adminService.getAllBikes().subscribe({
      next: (res: any) => {
        const data = res.result;
        const { bike_brand, bike_name, model_year, type, price } =
          this.searchForm.value;

        // this.allBikes = data.filter((item: any) =>
        //   (item.bike_name.toLowerCase().includes(bike_name.toLowerCase())) && (item.bike_brand === bike_brand)
        // );

        this.allBikes = data.filter(
          (item: any) =>
            (bike_name && item.bike_name.toLowerCase().includes(bike_name.toLowerCase())) &&
            (bike_brand && item.bike_brand === bike_brand)
        );

        this.searchedBikeAvailable = this.allBikes.length > 0;

        console.log('all bikes', this.allBikes);
      },
      error: (err) => {
        this.snackbar.openSnackBar(err.error, 'Close', 'error-snackbar');
      },
    });
  }
}
