import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { tap, map } from 'rxjs/operators';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  allBikes: any;

  bikes = [
    {
      brand: 'Brand1',
      name: 'Model1',
      image:
        'https://imgd.aeplcdn.com/664x374/n/cw/ec/115871/mt-15-v2-right-front-three-quarter-3.jpeg?isig=0&q=80',
      price: 1000,
      color: 'Red',
      description: 'Description for Model1',
    },
    {
      brand: 'Brand2',
      name: 'Model2',
      image:
        'https://imgd.aeplcdn.com/664x374/n/cw/ec/115871/mt-15-v2-right-front-three-quarter-3.jpeg?isig=0&q=80',
      price: 1200,
      color: 'Blue',
      description: 'Description for Model2',
    },
  ];

  constructor(
    private adminService: AdminService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getAllBikes();
    console.log('My bikes', this.allBikes);
  }

  getAllBikes() {
    this.adminService.getAllBikes().subscribe({
      next: (res: any) => {
        if(res.success) {
          console.log('here', res);
          this.allBikes = res.result;
        }else {
          this.snackbar.openSnackBar(res.error, 'Close', 'error-snackbar');
        }
      },
      error: (err) => {
        this.snackbar.openSnackBar(err.error.error, 'Close', 'error-snackbar');
      },
    });
  }

  deleteBike(id: string) {
    this.adminService.deleteBike(id).subscribe({
      next: (res: any) => {
        if(res.success) {
          this.getAllBikes()
          this.snackbar.openSnackBar(res.message, 'Close', 'success-snackbar');
        }else {
          this.snackbar.openSnackBar(res.error, 'Close', 'error-snackbar');
        }
      },
      error: (err) => {
        this.snackbar.openSnackBar(err.error.error, 'Close', 'error-snackbar');
      }
    });
  }

  updateBike() {
    console.log('Update bike');
  }
}
