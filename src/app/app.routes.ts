import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'users' },
  {
    path: 'users',
    loadComponent: () => import('./demo/pages/users-demo.component').then(m => m.UsersDemoComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./demo/pages/products-demo.component').then(m => m.ProductsDemoComponent),
  },
  {
    path: 'forms',
    loadComponent: () => import('./core/forms/form-list/app-form-list.component').then(m => m.AppFormListComponent),
  },
  {
    path: 'form-list',
    loadComponent: () => import('./core/forms/form-list/app-form-list.component').then(m => m.AppFormListComponent),
  },
  {
    path: 'form-builder/:id',
    loadComponent: () => import('./core/forms/form-builder/form-builder.component').then(m => m.FormBuilderComponent),
  },
  { path: '**', redirectTo: 'users' },
];
