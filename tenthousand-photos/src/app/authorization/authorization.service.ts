import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Authorization } from './authorization.interface';

@Injectable()
export class AuthorizationService {
  private isAuth = false;
  private authToken: string;
  private isAuthenticatedSubject = new Subject<boolean>();
  private tokenExpiredTimer;

  constructor(private http: HttpClient, private router: Router) {}

  addUser(email: string, password: string) {
    const authReq: Authorization = {
      email,
      password,
    };
    this.http
      .post('http://localhost:3000/api/users/register', authReq)
      .subscribe((res) => {
        console.log('addUser response', res);
      });
  }

  login(email: string, password: string) {
    const authReq: Authorization = {
      email,
      password,
    };
    this.http
      .post('http://localhost:3000/api/users/login', authReq)
      .subscribe((res: any) => {
        this.authToken = res.token;
        // check if we do have a valid token first to set auth flags
        if (this.authToken) {
          this.isAuth = true;
          this.isAuthenticatedSubject.next(true);
          const timeExpires = res.expiresIn;
          this.tokenExpiredTimer = setTimeout(() => {
            this.logout();
          }, timeExpires * 1000);
          console.log('timeExpires', timeExpires);
          const currentTime = new Date();
          const expirationTime = new Date(
            currentTime.getTime() + timeExpires * 1000
          );
          console.log('expirationTime', expirationTime);

          this.storeLocalStorageToken(this.authToken, expirationTime);
          this.router.navigate(['/']);
        }
      });
  }

  getToken(): string {
    return this.authToken;
  }

  getIsAuthenticated() {
    return this.isAuthenticatedSubject.asObservable();
  }

  getAuthFlag() {
    return this.isAuth;
  }

  logout() {
    this.authToken = null;
    this.isAuth = false;
    this.isAuthenticatedSubject.next(false);
    clearTimeout(this.tokenExpiredTimer);
    this.clearLocalStorageToken();
    this.router.navigate(['/']);
  }

  //add logic to make sure that token is stored in localStorage when valid
  storeLocalStorageToken(token: string, expiration: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expiration.toISOString());
  }

  clearLocalStorageToken() {
    localStorage.clear();
  }

  //authenticate user if token in local storage is still valid
  //need this for when a user reloads the page
  // validateUser() {
  //   const existingToken: any = this.getLocalToken();
  //   const now = new Date();
  //   const isTokenExpired: any =
  //     existingToken.expiration.getTime() - now.getTime();
  //   if (isTokenExpired > 0) {
  //     this.authToken = existingToken.token;
  //     this.isAuth = true;
  //     this.tokenExpiredTimer = setTimeout(() => {
  //       this.logout();
  //     }, isTokenExpired / 1000);
  //     this.isAuthenticatedSubject.next(true);
  //   }
  // }

  //check if items exist in local storage that can authenticate the user
  // getLocalToken() {
  //   const token = localStorage.getItem('token');
  //   const expiration = localStorage.getItem('expiration');
  //   if (!token || !expiration) {
  //     return;
  //   }
  //   return {
  //     token,
  //     expiration: new Date(expiration),
  //   };
  // }
}