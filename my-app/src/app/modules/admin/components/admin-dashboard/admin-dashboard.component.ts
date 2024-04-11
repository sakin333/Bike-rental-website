import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { tap, map } from 'rxjs/operators';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { default_url } from 'src/app/constants/constant';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  public allBikes: any;
  public defaultUrl = default_url;
  public bookedBikesArray: any;
  public pendingRequest: number = 0;
  public approvedRequest: number = 0;
  public notApprovedRequest: number = 0;

  constructor(
    private adminService: AdminService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getAllBikes();
    this.getBookingsData();
  }

  public getAllBikes(): void {
    this.adminService.getAllBikes().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.allBikes = res.result;
          // console.log('in dashboard', this.allBikes);
        } else {
          this.snackbar.openSnackBar(res.error, 'Close', 'error-snackbar');
        }
      },
      error: (err) => {
        this.snackbar.openSnackBar(err.error.error, 'Close', 'error-snackbar');
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

  public getBookingsData(): void {
    this.adminService.getAllBikes().subscribe({
      next: (res: any) => {
        if (res.success) {
          const bikeData = res.result;
          bikeData.forEach((item: any) => {
            if (item?.booking) {
              const bookingData = item.booking;
              bookingData.forEach((bookingItem: any) => {
                if (bookingItem.status === 'Pending') {
                  this.pendingRequest += 1;
                } else if (bookingItem.status === 'Approved') {
                  this.approvedRequest += 1;
                } else {
                  this.notApprovedRequest += 1;
                }
              });
            } else {
              console.log('No booking data available');
            }
          });
        } else {
          console.log('Error occured while fetching data');
        }
      },
      error: (err) => {
        console.log('Error occured', err);
      },
    });
  }
}
