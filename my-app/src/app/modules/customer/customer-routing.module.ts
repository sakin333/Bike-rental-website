import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { BookBikeComponent } from './components/book-bike/book-bike.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { NotificationComponent } from './components/notification/notification.component';
import { BikeDetailsComponent } from './components/bike-details/bike-details.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { SearchBikeComponent } from './components/search-bike/search-bike.component';

const routes: Routes = [
  { path: 'dashboard', component: CustomerDashboardComponent },
  { path: 'book/:id', component: BookBikeComponent },
  { path: 'mybookings', component: MyBookingsComponent },
  { path: 'notifications/:id', component: NotificationComponent },
  { path: 'bike/details/:id', component: BikeDetailsComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'search-bike', component: SearchBikeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
