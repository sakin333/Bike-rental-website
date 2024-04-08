import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Bike } from 'src/app/model/Bike';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css'],
})
export class CustomerDashboardComponent {
  public allBikes: Bike[] = [];

  constructor(
    private customerService: CustomerService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getAllBikes();
  }

  public getAllBikes(): void {
    this.customerService.getAllBikes().subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log('here', res);
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
}
