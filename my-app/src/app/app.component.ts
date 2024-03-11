import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'my-app';

  constructor(private authService: AuthService, private router: Router) {}

  isAdminLoggedIn: boolean = false;
  isCustomerLoggedIn: boolean = false;
  isUserPresent: boolean = false;

  ngOnInit(): void {
    console.log('oninit called');
    // this.router.events.subscribe((event) => {
    //   if(event instanceof NavigationEnd) {
    //     this.checkForUser()
    //     this.isAdminLoggedIn = this.authService.isAdmin()
    //     this.isCustomerLoggedIn = this.authService.isCustomer()

    //     if(this.isUserPresent) {
    //       if(this.isAdminLoggedIn) {
    //         this.router.navigateByUrl('/admin/dashboard')
    //       }else if(this.isCustomerLoggedIn) {
    //         this.router.navigateByUrl('/customer/dashboard')
    //       }
    //     }else {
    //       this.router.navigateByUrl('/login')
    //     }
    //   }
    // })
    this.checkForUser();
    this.isAdminLoggedIn = this.authService.isAdmin();
    this.isCustomerLoggedIn = this.authService.isCustomer();

    if (this.isUserPresent) {
      if (this.isAdminLoggedIn) {
        this.router.navigateByUrl('/admin/dashboard');
      } else if (this.isCustomerLoggedIn) {
        this.router.navigateByUrl('/customer/dashboard');
      }
    } else {
      this.router.navigateByUrl('/login');
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAdminLoggedIn = this.authService.isAdmin();
        this.isCustomerLoggedIn = this.authService.isCustomer();
      }
    });
  }

  checkForUser() {
    const user = this.authService.getUser();
    this.isUserPresent = user !== null;
  }

  logout() {
    this.authService.logout();
    this.isAdminLoggedIn = false;
    this.isCustomerLoggedIn = false;
    this.router.navigateByUrl('/login');
  }
}
