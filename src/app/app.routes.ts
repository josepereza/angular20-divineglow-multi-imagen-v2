import { Routes } from '@angular/router';
import path from 'path';
import { Home } from './components/home/home';
import { ProductList } from './components/product-list/product-list';
import { Details } from './components/details/details';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';
import { ProductListAdmin } from './admin/pages/product-list-admin/product-list-admin';
import { ProductFormComponent } from './admin/pages/product-form/product-form';
import { authGuard } from './admin/guards/auth-guard';
import { Login } from './admin/pages/login/login';
import { Payment } from './pages/payment/payment';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'admin', component: ProductListAdmin, canActivate: [authGuard] },
  {
    path: 'pedidos',
    loadComponent: () => import('./admin/pages/orders-admin/orders-admin'),
  },
  { path: 'login', component: Login },
  { path: 'products', component: ProductList },
  { path: 'product/:id', component: Details },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'payment', component: Payment },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
