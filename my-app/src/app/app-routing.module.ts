import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './auth/components/signup/signup.component';
import { LoginComponent } from './auth/components/login/login.component';
import { canActivate } from './auth/services/auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'register', component: SignupComponent},
  { path: 'login', component: LoginComponent},
  { path: 'admin', loadChildren : () => import("./modules/admin/admin.module").then(m => m.AdminModule)}, //lazyloading
  { path: 'customer', loadChildren : () => import("./modules/customer/customer.module").then(m => m.CustomerModule)}, 
  { path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
