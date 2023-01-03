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


const routes: Routes = [
  { path: '',  component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product/:id', component: ViewProductComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'cart', component: CartComponent },

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
