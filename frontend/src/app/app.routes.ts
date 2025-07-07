import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
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
            path: 'add',
            loadComponent: () => import('./features/user-management/user-add/user-add.component').then(m => m.UserAddComponent)
          },
          {
            path: 'roles',
            loadComponent: () => import('./features/user-management/user-roles/user-roles.component').then(m => m.UserRolesComponent)
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
            path: 'add',
            loadComponent: () => import('./features/package-management/package-add/package-add.component').then(m => m.PackageAddComponent)
          },
          {
            path: 'pricing',
            loadComponent: () => import('./features/package-management/package-pricing/package-pricing.component').then(m => m.PackagePricingComponent)
          },
          {
            path: 'subscriptions',
            loadComponent: () => import('./features/package-management/package-subscriptions/package-subscriptions.component').then(m => m.PackageSubscriptionsComponent)
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
            path: 'add',
            loadComponent: () => import('./features/feature-management/feature-add/feature-add.component').then(m => m.FeatureAddComponent)
          },
          {
            path: 'api-config',
            loadComponent: () => import('./features/feature-management/api-config/api-config.component').then(m => m.ApiConfigComponent)
          },
          {
            path: 'testing',
            loadComponent: () => import('./features/feature-management/feature-testing/feature-testing.component').then(m => m.FeatureTestingComponent)
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