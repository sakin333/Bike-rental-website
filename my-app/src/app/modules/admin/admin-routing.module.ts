import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { BikeComponent } from './components/bike/bike.component';
import { UpdateBikeComponent } from './components/update-bike/update-bike.component';
import { GetBookingsComponent } from './components/get-bookings/get-bookings.component';
import { SearchBikeComponent } from './components/search-bike/search-bike.component';
import { BikeDetailsComponent } from './components/bike-details/bike-details.component';

const routes: Routes = [
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'bike', component: BikeComponent },
  { path: 'bike/details/:id', component: BikeDetailsComponent },
  { path: 'bike/:id', component: UpdateBikeComponent },
  { path: 'bookings', component: GetBookingsComponent },
  { path: 'search', component: SearchBikeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
