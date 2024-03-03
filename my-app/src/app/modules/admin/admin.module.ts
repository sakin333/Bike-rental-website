import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { BikeComponent } from './components/bike/bike.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    BikeComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule
  ]
})
export class AdminModule { }
