import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { default_url } from 'src/app/constants/constant';
import { User } from 'src/app/model/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public signUp(user: User): Observable<any> {
    return this.http.post(`${default_url}/signup`, user);
  }

  public logIn(credentials: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${default_url}/login`, credentials);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public getUser(): User | null {
    const userJson = localStorage.getItem('user');

    if (userJson !== null) {
      return JSON.parse(userJson);
    } else {
      return null;
    }
  }

  public isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }

  public isCustomer(): boolean {
    const user = this.getUser();
    return user?.role === 'CUSTOMER';
  }

  public isLoggedIn(): boolean {
    return this.isAdmin() || this.isCustomer();
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('bookedBikes');
  }

  public getMyBookings(): any {
    const bikeJson = localStorage.getItem('bookedBikes');
    if (bikeJson) {
      return JSON.parse(bikeJson);
    }
  }
}
