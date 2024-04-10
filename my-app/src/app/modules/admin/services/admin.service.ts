import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { default_url } from 'src/app/constants/constant';
import { Bike } from 'src/app/model/Bike';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient, private authServcie: AuthService) {}

  public getUsers(): Observable<any> {
    return this.http.get(`${default_url}/users`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  public addBike(bike: any): Observable<any> {
    return this.http.post(`${default_url}/addBike`, bike, {
      headers: this.createAuthorizationHeader(),
    });
  }

  public getAllBikes(): Observable<any> {
    return this.http.get(`${default_url}/getAllBikes`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  public updateBike(
    id: string | undefined,
    bike: any
  ): Observable<any> {
    return this.http.post(`${default_url}/updateBike?id=${id}`, bike, {
      headers: this.createAuthorizationHeader(),
    });
  }

  public deleteBike(id: string | undefined): Observable<any> {
    return this.http.delete(`${default_url}/deleteBike?id=${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  public changeBookingStatus(
    bookingId: string,
    status: string,
    data: any
  ): Observable<any> {
    return this.http.post(
      `${default_url}/admin/booking?bookingId=${bookingId}&status=${status}`,
      data,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  public createAuthorizationHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
      'Authorization',
      'Bearer ' + this.authServcie.getToken()
    );
  }
}
