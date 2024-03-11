import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { default_url } from 'src/app/constants/constant';
import { Bike } from 'src/app/model/Bike';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private authServcie: AuthService) { }

  addBike(bike: Bike) {
    return this.http.post(`${default_url}/addBike`, bike, {
      headers: this.createAuthorizationHeader()
    })
  }

  getAllBikes() {
    return this.http.get(`${default_url}/getAllBikes`, {
      headers: this.createAuthorizationHeader()
    })
  }

  updateBike(id: string | undefined, bike: Bike | undefined) {
    return this.http.post(`${default_url}/updateBike?id=${id}`, bike, {
      headers: this.createAuthorizationHeader()
    })
  }

  deleteBike(id: string | undefined) {
    return this.http.delete(`${default_url}/deleteBike?id=${id}`, {
      headers: this.createAuthorizationHeader()
    })
  }

  createAuthorizationHeader(): HttpHeaders{
    let authHeaders: HttpHeaders = new HttpHeaders()
    return authHeaders.set(
      'Authorization',
      'Bearer ' + this.authServcie.getToken()
    )
  }

}
