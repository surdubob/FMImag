import { Component } from '@angular/core';
import {UserModify} from "../../dto/user-modify";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user: UserModify = { id: 0, username: '', password: '', phoneNo: '', email: '', roleId: 0 }

  confirmPasswordModel = ''

  constructor(private userService: UserService, private router: Router) {
  }

  createUser() {
    if (this.user.password == this.confirmPasswordModel) {
      this.userService.createUser(this.user).subscribe(u => {
        console.log(u);
        this.router.navigateByUrl("/login");
      });
    }
  }

}
