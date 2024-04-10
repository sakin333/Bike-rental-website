import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { default_url } from 'src/app/constants/constant';

@Component({
  selector: 'app-bike-details',
  templateUrl: './bike-details.component.html',
  styleUrls: ['./bike-details.component.css'],
})
export class BikeDetailsComponent implements OnInit {
  public bikeDetails: any;
  public bikeId: string | null = null;
  public defaultUrl = default_url;

  constructor(
    private adminService: AdminService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.bikeId = this.activeRoute.snapshot.paramMap.get('id');
    this.filterBike();
  }

  public filterBike(): void {
    this.adminService.getAllBikes().subscribe({
      next: (res: any) => {
        this.bikeDetails = res.result.find(
          (element: any) => element._id === this.bikeId
        );
      },
    });
  }
}
