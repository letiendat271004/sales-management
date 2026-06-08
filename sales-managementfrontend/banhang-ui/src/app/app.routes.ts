import { Routes } from '@angular/router';
import { ProductComponent } from './pages/product/product';
import { CategoryComponent } from './pages/category/category';
import { SaleComponent } from './pages/sale/sale';
import { OrderComponent } from './pages/order/order';

export const routes: Routes = [
  {
    path: '',
    component: ProductComponent
  },
  {
    path: 'categories',
    component: CategoryComponent
  },
  {
    path: 'sale',
    component: SaleComponent
  },
  {
    path: 'orders',
    component: OrderComponent
  }
];