import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { BikeComponent } from './components/bike/bike.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateBikeComponent } from './components/update-bike/update-bike.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    BikeComponent,
    UpdateBikeComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
