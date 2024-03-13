import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { bikeBrands, modelYears, bikeColors } from 'src/app/constants/constant';
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
  colors = bikeColors;
  allBikes: any = [];

  constructor(
    private adminService: AdminService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      bike_brand: new FormControl(null),
      bike_name: new FormControl(null),
      model_year: new FormControl(null),
      color: new FormControl(null),
      price: new FormControl(null),
    });
  }

  onSearchBike() {
    this.adminService.getAllBikes().subscribe({
      next: (res: any) => {
        const data = res.result;
        const { bike_brand, bike_name, model_year, color, price } = this.searchForm.value

        this.allBikes = data.filter((item: any) => 
          (item.bike_name.toLowerCase().includes(bike_name.toLowerCase()))
        );

        console.log('all bikes', this.allBikes);
      },
      error: (err) => {
        this.snackbar.openSnackBar(err.error, 'Close', 'error-snackbar');
      },
    });
  }
}
