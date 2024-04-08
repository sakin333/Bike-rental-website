import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { BikeComponent } from './components/bike/bike.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateBikeComponent } from './components/update-bike/update-bike.component';
import { GetBookingsComponent } from './components/get-bookings/get-bookings.component';
import { SearchBikeComponent } from './components/search-bike/search-bike.component';
import { BikeDetailsComponent } from './components/bike-details/bike-details.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    BikeComponent,
    UpdateBikeComponent,
    GetBookingsComponent,
    SearchBikeComponent,
    BikeDetailsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModuleModule,
  ],
})
export class AdminModule {}
