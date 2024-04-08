import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackComponent } from './modules/customer/components/feedback/feedback.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'my-app';

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  public isAdminLoggedIn: boolean = false;
  public isCustomerLoggedIn: boolean = false;
  public isUserPresent: boolean = false;
  public notificationNumber: number | null = null;
  public isMenuShown: boolean = false;

  ngOnInit(): void {
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
      this.router.navigateByUrl('/home');
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAdminLoggedIn = this.authService.isAdmin();
        this.isCustomerLoggedIn = this.authService.isCustomer();
      }
    });
  }

  private checkForUser(): void {
    const user = this.authService.getUser();
    this.isUserPresent = user !== null;
  }

  public logout(): void {
    this.authService.logout();
    this.isAdminLoggedIn = false;
    this.isCustomerLoggedIn = false;
    this.router.navigateByUrl('/home');
  }

  public toggleMenu(): void {
    this.isMenuShown = !this.isMenuShown;
  }

  public openFeedbackDialog(): void {
    this.dialog.open(FeedbackComponent);
  }
}
