import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { default_url } from 'src/app/constants/constant';
import { User } from 'src/app/model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signUp(user: User) {
    return this.http.post(`${default_url}/signup`, user)
  }

  logIn(credentials: { email: string, password: string}) {
    return this.http.post(`${default_url}/login`, credentials)
  }

  getToken() {
    return localStorage.getItem("token")
  }

  getUser() {
    const userJson = localStorage.getItem("user")

    if(userJson !== null) {
      return JSON.parse(userJson)
    }else {
      return null
    }
  }

  isAdmin() {
    const user = this.getUser()
    return user.role === "ADMIN"
  }

  isCustomer() {
    const user = this.getUser()
    return user.role === "CUSTOMER"
  }

  isLoggedIn() {
    return this.isAdmin() || this.isCustomer()
  }

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }
 }
