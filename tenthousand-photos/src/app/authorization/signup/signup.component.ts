import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  constructor(private authSvc: AuthorizationService) {}

  onSubmit(form: NgForm) {
      this.authSvc.addUser(form.value.email, form.value.password);
  }
}
