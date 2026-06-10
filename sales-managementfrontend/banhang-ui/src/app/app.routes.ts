import { Routes } from '@angular/router';

import { ProductComponent } from './pages/product/product';
import { CategoryComponent } from './pages/category/category';
import { SaleComponent } from './pages/sale/sale';
import { OrderComponent } from './pages/order/order';
import { LoginComponent } from './pages/login/login';

import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: ProductComponent,
    canActivate: [authGuard]
  },
  {
    path: 'categories',
    component: CategoryComponent,
    canActivate: [authGuard]
  },
  {
    path: 'sale',
    component: SaleComponent,
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    component: OrderComponent,
    canActivate: [authGuard]
  }
];