import { NgModule } from '@angular/core';
import {RouterModule, Routes, UrlSegment} from '@angular/router';
import {UserRole} from "./helper/user.roles";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {AuthGuard} from "./helper/auth.guard";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";


const routes: Routes = [
  { path: '',  component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  // { path: 'dashboard/edit/:id', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: [UserRole.Admin]} },
  // { path: 'users', component: UsersComponent, canActivate: [AuthGuard], data: { roles: [UserRole.Admin]}},
  // { path: 'users/insert', component: EditUserComponent, canActivate: [AuthGuard], data: { roles: [UserRole.Admin]}},
  // { path: 'users/view/:id', component: EditUserComponent, canActivate: [AuthGuard], data: { roles: [UserRole.Admin]}},
  // { path: 'users/edit/:id', component: EditUserComponent, canActivate: [AuthGuard], data: { roles: [UserRole.Admin]}},


  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
