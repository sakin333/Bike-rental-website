import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  public message: string = '';
  public bookingId: string | null = null;
  public bikeDetails: any;

  constructor(
    private customerService: CustomerService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.bookingId = this.activeRoute.snapshot.paramMap.get('id');
    this.getBookingDetailsById();
  }

  public getBookingDetailsById(): void {
    this.customerService.getBookingsById(this.bookingId).subscribe({
      next: (res: any) => {
        this.bikeDetails = res.result;
        if (this.bikeDetails && this.bikeDetails.booking[0].status) {
          this.generateMessage(this.bikeDetails.booking[0].status);
        }
      },
      error: (err) => {
        console.error('Error occurred while fetching booking details', err);
      },
    });
  }

  public generateMessage(status: string): void {
    switch (status) {
      case 'APPROVED':
        this.message = `Your booking has been approved. Please pickup your bike at out shop location and make sure to bring the relevant documents.`;
        break;
      case 'REJECTED':
        this.message = `Your booking has been rejected. Please contact customer support for further assistance.`;
        break;
      default:
        this.message = `Your booking status is ${status}. Please check back later for updates.`;
        break;
    }
  }

  public closeNotification(): void {
    this.message = '';
  }
}
