import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private authSvc: AuthorizationService) {}

  onSubmit(form: NgForm) {
    this.authSvc.login(form.value.email, form.value.password);
  }
}
