import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bike-details',
  templateUrl: './bike-details.component.html',
  styleUrls: ['./bike-details.component.css'],
})
export class BikeDetailsComponent implements OnInit {
  public bikeDetails: any;
  public bikeId: string | null = null;

  constructor(
    private customerService: CustomerService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bikeId = this.activeRoute.snapshot.paramMap.get('id');
    this.filterBike();
  }

  public filterBike(): void {
    this.customerService.getAllBikes().subscribe({
      next: (res: any) => {
        this.bikeDetails = res.result.find(
          (element: any) => element._id === this.bikeId
        );
      },
    });
  }

  public onBookClicked(): void {
    this.router.navigateByUrl(`/customer/book/${this.bikeId}`);
  }
}
