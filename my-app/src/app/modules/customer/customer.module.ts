import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { MaterialModule } from '../material/material.module';
import { BookBikeComponent } from './components/book-bike/book-bike.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { BikeDetailsComponent } from './components/bike-details/bike-details.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { SearchBikeComponent } from './components/search-bike/search-bike.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';

@NgModule({
  declarations: [
    CustomerDashboardComponent,
    BookBikeComponent,
    MyBookingsComponent,
    BikeDetailsComponent,
    FeedbackComponent,
    PersonalInfoComponent,
    SearchBikeComponent,
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModuleModule,
  ],
})
export class CustomerModule {}
