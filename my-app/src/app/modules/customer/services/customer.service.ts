import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { default_url } from 'src/app/constants/constant';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllBikes() {
    return this.http.get(`${default_url}/getAllBikes`, {
      headers: this.createAuthorizationHeader()
    })
  }

  bookBikes(userId: string, bikeId: string, data: any) {
    return this.http.post(`${default_url}/booking?userId=${userId}&bikeId=${bikeId}`, data, {
      headers: this.createAuthorizationHeader()
    })
  }

  createAuthorizationHeader(): HttpHeaders{
    let authHeaders: HttpHeaders = new HttpHeaders()
    return authHeaders.set(
      'Authorization',
      'Bearer ' + this.authService.getToken()
    )
  }

}
