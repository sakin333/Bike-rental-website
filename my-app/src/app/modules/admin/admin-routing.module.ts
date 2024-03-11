import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { BikeComponent } from './components/bike/bike.component';
import { UpdateBikeComponent } from './components/update-bike/update-bike.component';

const routes: Routes = [
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'bike', component: BikeComponent },
  {path: 'bike/:id', component: UpdateBikeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
