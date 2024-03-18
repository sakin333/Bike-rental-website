import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  userPresent: any;

  ngOnInit(): void {
    this.userPresent = this.authService.getUser();
  }

  onExploreClicked() {
    if (this.userPresent?.role === 'ADMIN') {
      this.router.navigateByUrl('/admin/dashboard');
    } else if (this.userPresent?.role === 'CUSTOMER') {
      this.router.navigateByUrl('/customer/dashboard');
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
