import { CookieService } from "ngx-cookie-service";
import { AuthenticationService } from "../services/login/authentication.service";

export function appInitializer(authenticationService: AuthenticationService, cookieService: CookieService) {
    return () => new Promise((resolve: any) => {
        // attempt to refresh token on app start up to auto authenticate

        if (cookieService.check('refreshToken')){
            authenticationService.refreshToken()
        .subscribe()
        .add(resolve);
        } else {
            resolve();
        }
    });
}
