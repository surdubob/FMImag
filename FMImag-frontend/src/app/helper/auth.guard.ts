import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "../services/login/authentication.service";
import { SpinnerService } from "../services/spinner/spinner.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.userValue;
        
        if (user) {
            if (route.data["roles"] && route.data["roles"].indexOf(user.roleId) === -1) {
                // role not authorised so redirect to home page
                
                this.router.navigate(['/']);
                alert('Your user doesn\'t have the privilege to access this page');
                return false;
            }

            return true;
        } else {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }
}