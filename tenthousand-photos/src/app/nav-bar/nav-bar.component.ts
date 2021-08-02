import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthorizationService } from '../authorization/authorization.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  private isAuthSubscription: Subscription;
  isAuth: boolean = false;

  constructor(private authSvc: AuthorizationService) {}

  ngOnInit() {
    this.isAuth = this.authSvc.getAuthFlag();
    this.isAuthSubscription = this.authSvc
      .getIsAuthenticated()
      .subscribe((res) => {
        this.isAuth = res;
      });
  }

  onLogout() {
    this.authSvc.logout();
  }

  ngOnDestroy() {
    this.isAuthSubscription.unsubscribe();
  }
}
