import { Routes } from '@angular/router';
import { AdminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        children: [
          {
            path: 'list',
            loadComponent: () => import('./features/user-management/user-list/user-list.component').then(m => m.UserListComponent)
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'packages',
        children: [
          {
            path: 'list',
            loadComponent: () => import('./features/package-management/package-list/package-list.component').then(m => m.PackageListComponent)
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'features',
        children: [
          {
            path: 'list',
            loadComponent: () => import('./features/feature-management/feature-list/feature-list.component').then(m => m.FeatureListComponent)
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'reports',
        children: [
          {
            path: 'overview',
            loadComponent: () => import('./features/reports/reports-overview/reports-overview.component').then(m => m.ReportsOverviewComponent)
          },
          {
            path: 'users',
            loadComponent: () => import('./features/reports/reports-users/reports-users.component').then(m => m.ReportsUsersComponent)
          },
          {
            path: 'packages',
            loadComponent: () => import('./features/reports/reports-packages/reports-packages.component').then(m => m.ReportsPackagesComponent)
          },
          {
            path: 'revenue',
            loadComponent: () => import('./features/reports/reports-revenue/reports-revenue.component').then(m => m.ReportsRevenueComponent)
          },
          {
            path: 'export',
            loadComponent: () => import('./features/reports/reports-export/reports-export.component').then(m => m.ReportsExportComponent)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/admin/dashboard'
  }
]; 