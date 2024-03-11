import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { BookBikeComponent } from './components/book-bike/book-bike.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';

const routes: Routes = [
  { path: 'dashboard', component: CustomerDashboardComponent },
  { path: 'book/:id', component: BookBikeComponent },
  { path: 'mybookings', component: MyBookingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
