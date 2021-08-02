import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthorizationService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authSvc.getToken();
    
    //creating a new request with headers by copying the original
    //to avoid unwanted bugs
    const newRequest = req.clone({
      headers: req.headers.set('Authorization', "Bearer " + token)
    })
    
    return next.handle(newRequest);
  }
}
