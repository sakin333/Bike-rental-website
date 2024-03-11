import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { MaterialModule } from '../material/material.module';
import { BookBikeComponent } from './components/book-bike/book-bike.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';


@NgModule({
  declarations: [
    CustomerDashboardComponent,
    BookBikeComponent,
    MyBookingsComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class CustomerModule { }
