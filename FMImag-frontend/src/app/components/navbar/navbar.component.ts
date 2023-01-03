import { Component, OnInit } from '@angular/core';

import { UserRole } from 'src/app/helper/user.roles';
import { AuthenticationService } from 'src/app/services/login/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.user.subscribe(u => {

    });
  }

  navbarOpen = false;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }


  logout() {
    this.authenticationService.logout();
  }

  get user() {
    return this.authenticationService.userValue;
  }

  get userRole() {
    if(this.user)
      return UserRole[this.user.roleId];
    return 'norole';
  }

  get UserRole() {
    return UserRole;
  }
}
