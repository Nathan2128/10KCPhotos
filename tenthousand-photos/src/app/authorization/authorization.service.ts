import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorService } from '../shared/error.service';
import { Authorization } from './authorization.interface';

@Injectable()
export class AuthorizationService {
  private isAuth = false;
  private authToken: string;
  private isAuthenticatedSubject = new Subject<boolean>();
  private tokenExpiredTimer;

  constructor(private http: HttpClient, private router: Router, private errorSvc: ErrorService) {}

  addUser(email: string, password: string) {
    const authReq: Authorization = {
      email,
      password,
    };
    this.http
      .post('http://localhost:3000/api/users/register', authReq)
      .subscribe((res) => {
        console.log('addUser response', res);
      }, error => {
        if(error.status === 409) {
          this.errorSvc.showSnackbar("User already exists!", null, 3000);
        }
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
          const timeExpires = res.expiresIn; //in seconds from the back end
          this.startTokenTimer(timeExpires);
          console.log('timeExpires', timeExpires);
          const currentTime = new Date();
          //create a date object for when the token will expire
          const expirationTime = new Date(
            currentTime.getTime() + timeExpires * 1000 // convert to millisec
          );
          console.log('expirationTime', expirationTime);

          this.storeTokenLocalStorage(this.authToken, expirationTime);
          this.router.navigate(['/']);
        }
      }, error => {
        if(error.status = 401){ 
          this.errorSvc.showSnackbar(error.error.message, null, 3000);
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
    this.clearTokenLocalStorage();
    this.router.navigate(['/']);
  }

  //add logic to make sure that token is stored in localStorage when valid
  storeTokenLocalStorage(token: string, expiration: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expiration.toISOString());
  }

  clearTokenLocalStorage() {
    localStorage.clear(); //use remove item instead if this causes bugs
  }

  // authenticate user if token in local storage is still valid
  // need this for when a user reloads the page
  //check is existing token in local storage is expired or not
  validateUser() {
    const existingToken: any = this.getTokenLocalStorage();
    const now = new Date();
    const timeRemaining: any =
      existingToken?.expiration.getTime() - now.getTime(); //calculatime time left on token
    if (timeRemaining > 0) {
      this.authToken = existingToken.token;
      this.isAuth = true;
      this.startTokenTimer(timeRemaining / 1000); //convert to seconds
      this.isAuthenticatedSubject.next(true);
    }
  }

  //check if items exist in local storage that can authenticate the user
  getTokenLocalStorage() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    return {
      token: token,
      expiration: new Date(expiration),
    };
  }

  startTokenTimer(timeLeft: number) {
    //value is in seconds
    this.tokenExpiredTimer = setTimeout(() => {
      this.logout();
    }, timeLeft * 1000);
  }
}
