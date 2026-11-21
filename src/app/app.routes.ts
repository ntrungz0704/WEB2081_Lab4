import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then((m) => m.Home),
  },
  {
    path: 'products',
    loadComponent: () => import('./components/products/products').then((m) => m.Products),
  },
  {
    path: 'bai_viet',
    loadComponent: () => import('./components/blogs/blogs').then((m) => m.Blogs),
  },
  {
    path: 'blogs',
    redirectTo: 'bai_viet',
    pathMatch: 'full',
  },
  {
    path: 'category/:slug',
    loadComponent: () => import('./components/products/products').then((m) => m.Products),
  },
  {
    path: 'product/:slug',
    loadComponent: () => import('./components/product/product').then((m) => m.ProductComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart').then((m) => m.Cart),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
