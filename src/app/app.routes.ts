import { Routes } from '@angular/router';
import { adminAuthGuard } from './admin/guards/admin-auth.guard';

export const routes: Routes = [
  // Main portfolio — root path
  {
    path: '',
    loadComponent: () =>
      import('./portfolio-shell.component').then(m => m.PortfolioShellComponent)
  },

  // Admin login — public, no guard
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./admin/pages/login/admin-login.component')
        .then(m => m.AdminLoginComponent)
  },

  // Admin redirect
  {
    path: 'admin',
    redirectTo: 'admin/login',
    pathMatch: 'full'
  },

  // Admin dashboard — protected by guard
  {
    path: 'admin/dashboard',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./admin/pages/dashboard/admin-dashboard.component')
        .then(m => m.AdminDashboardComponent)
  },

  // Catch all
  { path: '**', redirectTo: '' }
];
