import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {UserLogin} from 'src/app/dto/user.login';
import {environment} from 'src/environment';
import {SpinnerService} from "../spinner/spinner.service";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userSubject: BehaviorSubject<UserLogin | null>;
  public user: Observable<UserLogin | null>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private spinnerService: SpinnerService,
    private sanitizer: DomSanitizer
  ) {
    this.userSubject = new BehaviorSubject<UserLogin | null>(null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): UserLogin | null {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/authorization/authenticate`, {username, password }, { withCredentials: true })
      .pipe(map(user => {
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      }));
  }

  logout() {
    this.http.post<any>(`${environment.apiUrl}/authorization/revoke-token`, {}, { withCredentials: true }).subscribe(r => {
      this.stopRefreshTokenTimer();
      this.userSubject.next(null);
      this.router.navigate(['/login']);
      document.location.reload();
    });
  }

  refreshToken() {
    return this.http.post<any>(`${environment.apiUrl}/authorization/refresh-token`, {}, { withCredentials: true })
      .pipe(map((user) => {
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      }));
  }

  // helper methods

  private refreshTokenTimeout: any;

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.userValue!.token!.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);

    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
