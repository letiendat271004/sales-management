import { Routes } from '@angular/router';
import { ProductComponent } from './pages/product/product';
import { CategoryComponent } from './pages/category/category';

export const routes: Routes = [
  {
    path: '',
    component: ProductComponent
  },
  {
    path: 'categories',
    component: CategoryComponent
  }
];