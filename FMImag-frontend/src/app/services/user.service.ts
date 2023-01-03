import { Injectable } from '@angular/core';
import {UserModify} from "../dto/user-modify";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  createUser(user: UserModify) {
    return this.http.post<UserModify>(environment.apiUrl + '/users', user);
  }
}
