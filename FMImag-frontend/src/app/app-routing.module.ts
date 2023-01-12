import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {RegisterComponent} from "./components/register/register.component";
import {ProductsComponent} from "./components/products/products.component";
import {ViewProductComponent} from "./components/view-product/view-product.component";
import {CartComponent} from "./components/cart/cart.component";
import {AddProductComponent} from "./components/add-product/add-product.component";
import {UserRole} from "./helper/user.roles";


const routes: Routes = [
  { path: '',  component: HomeComponent, pathMatch: 'full', data: { no_sidenav: false } },
  { path: 'login', component: LoginComponent, data: { no_sidenav: true } },
  { path: 'register', component: RegisterComponent, data: { no_sidenav: true } },
  { path: 'products', component: ProductsComponent, data: { no_sidenav: false } },
  { path: 'products/:id', component: ProductsComponent, data: { no_sidenav: false } },
  { path: 'product/:id', component: ViewProductComponent, data: { no_sidenav: false } },
  { path: 'add-product', component: AddProductComponent, data: { no_sidenav: true, roles: [UserRole.Admin] } },
  { path: 'edit-product/:id', component: AddProductComponent, data: { no_sidenav: true, roles: [UserRole.Admin] } },
  { path: 'cart', component: CartComponent, data: { no_sidenav: true } },

  // { path: 'dashboard/edit/:id', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: [UserRole.Admin]} },
  // { path: 'users/view/:id', component: EditUserComponent, canActivate: [AuthGuard], data: { roles: [UserRole.Admin]}},
  // { path: 'users/edit/:id', component: EditUserComponent, canActivate: [AuthGuard], data: { roles: [UserRole.Admin]}},


  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
