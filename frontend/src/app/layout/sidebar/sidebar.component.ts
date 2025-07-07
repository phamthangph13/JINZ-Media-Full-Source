import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
  badge?: string;
  badgeClass?: string;
}

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, RouterModule],
    template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <!-- Logo Section -->
      <div class="sidebar-header">
        <div class="logo">
          <img src="assets/images/logo.png" alt="JINZMedia" class="logo-img" *ngIf="!isCollapsed">
          <img src="assets/images/logo-sm.png" alt="JM" class="logo-sm" *ngIf="isCollapsed">
          <span class="logo-text" *ngIf="!isCollapsed">JINZMedia</span>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li *ngFor="let item of menuItems; trackBy: trackByFn" 
              class="nav-item"
              [class.has-children]="item.children"
              [class.expanded]="item.expanded">
            
            <!-- Menu Item -->
            <a class="nav-link" 
               [routerLink]="item.route" 
               routerLinkActive="active"
               [class.no-route]="!item.route"
               (click)="handleMenuClick(item)"
               [title]="isCollapsed ? item.label : ''">
              
              <i class="nav-icon" [class]="item.icon"></i>
              <span class="nav-text" *ngIf="!isCollapsed">{{ item.label }}</span>
              
              <!-- Badge -->
              <span *ngIf="item.badge && !isCollapsed" 
                    class="badge" 
                    [class]="item.badgeClass">
                {{ item.badge }}
              </span>
              
              <!-- Expand Icon -->
              <i *ngIf="item.children && !isCollapsed" 
                 class="expand-icon fas fa-chevron-right"
                 [class.expanded]="item.expanded"></i>
            </a>

            <!-- Submenu -->
            <ul *ngIf="item.children && item.expanded && !isCollapsed" 
                class="nav-submenu">
              <li *ngFor="let child of item.children" class="nav-subitem">
                <a class="nav-sublink" 
                   [routerLink]="child.route" 
                   routerLinkActive="active">
                  <i class="nav-subicon" [class]="child.icon"></i>
                  <span class="nav-subtext">{{ child.label }}</span>
                  <span *ngIf="child.badge" 
                        class="badge" 
                        [class]="child.badgeClass">
                    {{ child.badge }}
                  </span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer" *ngIf="!isCollapsed">
        <div class="sidebar-version">
          <small class="text-muted">Version 1.0.0</small>
        </div>
      </div>
    </aside>
  `,
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      route: '/admin/dashboard'
    },
    {
      label: 'Quản lí người dùng',
      icon: 'fas fa-users',
      children: [
        {
          label: 'Danh sách người dùng',
          icon: 'fas fa-list',
          route: '/admin/users/list'
        },
        {
          label: 'Thêm người dùng',
          icon: 'fas fa-user-plus',
          route: '/admin/users/add'
        },
        {
          label: 'Vai trò & Quyền',
          icon: 'fas fa-user-shield',
          route: '/admin/users/roles'
        }
      ]
    },
    {
      label: 'Quản lí các gói',
      icon: 'fas fa-box',
      children: [
        {
          label: 'Danh sách gói',
          icon: 'fas fa-boxes',
          route: '/admin/packages/list'
        },
        {
          label: 'Tạo gói mới',
          icon: 'fas fa-plus-circle',
          route: '/admin/packages/add'
        },
        {
          label: 'Định giá gói',
          icon: 'fas fa-tags',
          route: '/admin/packages/pricing'
        },
        {
          label: 'Đăng ký gói',
          icon: 'fas fa-clipboard-check',
          route: '/admin/packages/subscriptions',
          badge: '12',
          badgeClass: 'badge-warning'
        }
      ]
    },
    {
      label: 'Quản lí tính năng',
      icon: 'fas fa-cogs',
      children: [
        {
          label: 'Danh sách tính năng',
          icon: 'fas fa-list-check',
          route: '/admin/features/list'
        },
        {
          label: 'Thêm tính năng',
          icon: 'fas fa-plus',
          route: '/admin/features/add'
        },
        {
          label: 'Cấu hình API',
          icon: 'fas fa-code',
          route: '/admin/features/api-config'
        },
        {
          label: 'Kiểm tra tính năng',
          icon: 'fas fa-check-double',
          route: '/admin/features/testing'
        }
      ]
    },
    {
      label: 'Báo cáo thống kê',
      icon: 'fas fa-chart-bar',
      children: [
        {
          label: 'Tổng quan',
          icon: 'fas fa-chart-pie',
          route: '/admin/reports/overview'
        },
        {
          label: 'Thống kê người dùng',
          icon: 'fas fa-users-cog',
          route: '/admin/reports/users'
        },
        {
          label: 'Thống kê gói',
          icon: 'fas fa-chart-line',
          route: '/admin/reports/packages'
        },
        {
          label: 'Doanh thu',
          icon: 'fas fa-dollar-sign',
          route: '/admin/reports/revenue'
        },
        {
          label: 'Xuất báo cáo',
          icon: 'fas fa-file-export',
          route: '/admin/reports/export'
        }
      ]
    },
    {
      label: 'Cài đặt',
      icon: 'fas fa-cog',
      children: [
        {
          label: 'Cài đặt chung',
          icon: 'fas fa-sliders-h',
          route: '/admin/settings/general'
        },
        {
          label: 'Email & SMS',
          icon: 'fas fa-envelope',
          route: '/admin/settings/notifications'
        },
        {
          label: 'Bảo mật',
          icon: 'fas fa-shield-alt',
          route: '/admin/settings/security'
        },
        {
          label: 'Sao lưu dữ liệu',
          icon: 'fas fa-database',
          route: '/admin/settings/backup'
        }
      ]
    }
  ];

  constructor(private router: Router) {}

  trackByFn(index: number, item: MenuItem): any {
    return item.label;
  }

  handleMenuClick(item: MenuItem) {
    if (item.children) {
      // Toggle submenu
      item.expanded = !item.expanded;
      
      // Close other expanded menus
      this.menuItems.forEach(menuItem => {
        if (menuItem !== item && menuItem.children) {
          menuItem.expanded = false;
        }
      });
    } else if (item.route) {
      // Navigate to route
      this.router.navigate([item.route]);
    }
  }
} 