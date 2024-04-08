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
  public allBikes: any;

  constructor(
    private adminService: AdminService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getAllBikes();
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
}
