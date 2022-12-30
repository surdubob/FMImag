import { Component } from '@angular/core';
import {UserLogin} from "./dto/user.login";
import {AuthenticationService} from "./services/login/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FMImag';

  user: UserLogin | null = null;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.user.subscribe(x => {
      this.user = x;
    });
  }
}
