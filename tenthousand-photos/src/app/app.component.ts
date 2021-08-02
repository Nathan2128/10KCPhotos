import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthorizationService } from './authorization/authorization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authSvc: AuthorizationService) {}

  ngOnInit() {
    // set token is user token has still not expired
    this.authSvc.validateUser();
  }
}
