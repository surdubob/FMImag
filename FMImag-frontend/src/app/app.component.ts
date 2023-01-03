import { Component } from '@angular/core';
import {UserLogin} from "./dto/user.login";
import {AuthenticationService} from "./services/login/authentication.service";
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterEvent} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FMImag';

  user: UserLogin | null = null;

  withoutSidenav = [
    '/login',
    '/register'
  ]

  hasSidenav = true;

  constructor(private authenticationService: AuthenticationService, public router: Router) { }

  ngOnInit(): void {
    this.authenticationService.user.subscribe(x => {
      this.user = x;
    });
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        for (const s of this.withoutSidenav) {
          if (val.url.includes(s)) {
            this.hasSidenav = false
            return;
          }
        }
        this.hasSidenav = true;
      }
    })
  }
}
