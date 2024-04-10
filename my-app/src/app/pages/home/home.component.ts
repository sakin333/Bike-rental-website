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
  public userPresent: any;

  images: string[] = [
    '../../../assets/bike-home.png',
    '../../../assets/apache.png',
    '../../../assets/fszs.png',
  ];
  currentImage: string = this.images[0];
  slideDirection: string = 'right';

  public navigate(direction: number): void {
    const currentIndex = this.images.indexOf(this.currentImage);
    const newIndex =
      (currentIndex + direction + this.images.length) % this.images.length;
    this.currentImage = this.images[newIndex];
    this.slideDirection = direction === 1 ? 'right' : 'left';
  }

  ngOnInit(): void {
    this.userPresent = this.authService.getUser();
  }

  public onExploreClicked(): void {
    if (this.userPresent?.role === 'ADMIN') {
      this.router.navigateByUrl('/admin/dashboard');
    } else if (this.userPresent?.role === 'CUSTOMER') {
      this.router.navigateByUrl('/customer/dashboard');
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
