import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { default_url } from 'src/app/constants/constant';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  public getAllBikes(): Observable<any> {
    return this.http.get(`${default_url}/getAllBikes`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  public bookBikes(userId: string, bikeId: string, data: any): Observable<any> {
    return this.http.post(
      `${default_url}/booking?userId=${userId}&bikeId=${bikeId}`,
      data,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  public getBookingsById(id: string | null): Observable<any> {
    return this.http.get(`${default_url}/customer/notifications/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  public cancelBooking(id: string | null): Observable<any> {
    return this.http.post(
      `${default_url}/cancel-booking?bookingId=${id}`,
      null,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  public postFeedback(data: any): Observable<any> {
    return this.http.post(`${default_url}/feedback`, data, {
      headers: this.createAuthorizationHeader(),
    });
  }

  private createAuthorizationHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
      'Authorization',
      'Bearer ' + this.authService.getToken()
    );
  }
}
