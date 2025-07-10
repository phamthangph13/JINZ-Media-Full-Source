import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-header',
    imports: [CommonModule, RouterModule],
    template: `
    <header class="header">
      <div class="header-content">
        <!-- Left Side - Menu Toggle -->
        <div class="header-left">
          <button 
            class="btn btn-link menu-toggle"
            (click)="toggleSidebar.emit()"
            type="button"
            aria-label="Toggle Menu">
            <i class="fas fa-bars"></i>
          </button>
          
          <div class="breadcrumb-section d-none d-md-block">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <a routerLink="/admin/dashboard">
                    <i class="fas fa-home"></i> Dashboard
                  </a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  {{ currentPageTitle }}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <!-- Right Side - User Actions -->
        <div class="header-right">
          <!-- Search Bar -->
          <div class="search-container d-none d-lg-block">
            <div class="input-group">
              <input 
                type="text" 
                class="form-control search-input"
                placeholder="Tìm kiếm..."
                #searchInput
                (keyup.enter)="performSearch(searchInput.value)">
              <button 
                class="btn btn-outline-secondary search-btn"
                type="button"
                (click)="performSearch(searchInput.value)">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>

          <!-- Notifications -->
          <div class="notification-dropdown dropdown">
            <button 
              class="btn btn-link notification-btn"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              <i class="fas fa-bell"></i>
              <span class="notification-badge" *ngIf="notificationCount > 0">
                {{ notificationCount }}
              </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end notification-menu">
              <li class="dropdown-header">
                <div class="d-flex justify-content-between align-items-center">
                  <span>Thông báo</span>
                  <button class="btn btn-sm btn-link" (click)="markAllAsRead()">
                    Đánh dấu đã đọc
                  </button>
                </div>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li *ngFor="let notification of notifications" class="notification-item">
                <a class="dropdown-item" [class.unread]="!notification.read">
                  <div class="notification-content">
                    <div class="notification-title">{{ notification.title }}</div>
                    <div class="notification-message">{{ notification.message }}</div>
                    <div class="notification-time">{{ notification.time }}</div>
                  </div>
                </a>
              </li>
              <li *ngIf="notifications.length === 0" class="dropdown-item text-center text-muted">
                Không có thông báo mới
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item text-center" routerLink="/admin/notifications">
                  Xem tất cả thông báo
                </a>
              </li>
            </ul>
          </div>

          <!-- User Profile -->
          <div class="user-dropdown dropdown">
            <button 
              class="btn btn-link user-btn"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              <img 
                [src]="currentUser?.avatar || 'assets/images/default-avatar.png'" 
                [alt]="currentUser?.name || 'User'"
                class="user-avatar">
              <span class="user-info d-none d-md-inline-block" *ngIf="currentUser">
                <span class="user-name">{{ currentUser.name }}</span>
                <span class="user-role">{{ currentUser.role === 'admin' ? 'Admin' : 'User' }}</span>
              </span>
              <i class="fas fa-chevron-down ms-2"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end user-menu">
              <li class="dropdown-header">
                <div class="user-details" *ngIf="currentUser">
                  <img 
                    [src]="currentUser?.avatar || 'assets/images/default-avatar.png'" 
                    [alt]="currentUser?.name || 'User'"
                    class="user-avatar-large">
                  <div class="user-text">
                    <div class="user-name">{{ currentUser.name }}</div>
                    <div class="user-email">{{ currentUser.email }}</div>
                  </div>
                </div>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item" (click)="profileMenuClick.emit('profile')">
                  <i class="fas fa-user me-2"></i> Hồ sơ cá nhân
                </a>
              </li>
              <li>
                <a class="dropdown-item" (click)="profileMenuClick.emit('settings')">
                  <i class="fas fa-cog me-2"></i> Cài đặt
                </a>
              </li>
              <li>
                <a class="dropdown-item" routerLink="/admin/help">
                  <i class="fas fa-question-circle me-2"></i> Trợ giúp
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item text-danger" (click)="logout()">
                  <i class="fas fa-sign-out-alt me-2"></i> Đăng xuất
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  `,
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() profileMenuClick = new EventEmitter<string>();

  currentPageTitle = 'Tổng quan';
  notificationCount = 3;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Subscribe to current user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  notifications = [
    {
      id: 1,
      title: 'Người dùng mới đăng ký',
      message: 'Có 5 người dùng mới đăng ký gói Premium',
      time: '5 phút trước',
      read: false
    },
    {
      id: 2,
      title: 'Báo cáo tháng hoàn thành',
      message: 'Báo cáo doanh thu tháng 12 đã sẵn sàng',
      time: '1 giờ trước',
      read: false
    },
    {
      id: 3,
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống sẽ bảo trì vào 2:00 AM ngày mai',
      time: '3 giờ trước',
      read: true
    }
  ];

  performSearch(query: string) {
    if (query.trim()) {
      console.log('Searching for:', query);
      // Implement search functionality
    }
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.notificationCount = 0;
  }

  logout() {
    this.authService.logout();
    this.toastr.success('Đăng xuất thành công');
    this.router.navigate(['/auth']);
  }
} 