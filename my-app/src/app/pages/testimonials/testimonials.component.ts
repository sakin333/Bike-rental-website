import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { default_url } from 'src/app/constants/constant';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css'],
})
export class TestimonialsComponent implements OnInit {
  public testimonials: any = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    let testimonialsObservable = this.getTestimonials();
    testimonialsObservable.subscribe({
      next: (res: any) => {
        if (res.success) {
          this.testimonials = res.result;
        }
      },
      error: (err) => {
        console.log('Something went wrong fetching testimonials', err.error);
      },
    });
  }

  public getTestimonials(): Observable<any> {
    return this.http.get(`${default_url}/testimonials`);
  }

  public starIcons(rating: number): string[] {
    const filledStars = Math.round(rating);
    const emptyStars = 5 - filledStars;
    return Array(filledStars)
      .fill('star')
      .concat(Array(emptyStars).fill('star_border'));
  }
}
