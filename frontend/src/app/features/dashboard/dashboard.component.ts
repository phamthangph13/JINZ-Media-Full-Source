import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule],
    template: `
    <div class="dashboard-container">
      <!-- Page Header -->
      <div class="dashboard-header">
        <h1 class="page-title">
          <i class="fas fa-tachometer-alt me-3"></i>
          Dashboard Tổng quan
        </h1>
        <p class="page-subtitle">
          Chào mừng trở lại! Đây là tổng quan về hệ thống JINZMedia Admin.
        </p>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div *ngFor="let stat of stats" class="stat-card" [class]="'stat-' + stat.type">
          <div class="stat-icon">
            <i [class]="stat.icon"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-change" [class.positive]="stat.change > 0" [class.negative]="stat.change < 0">
              <i [class]="stat.change > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ Math.abs(stat.change) }}% so với tháng trước
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h2 class="section-title">
          <i class="fas fa-bolt me-2"></i>
          Thao tác nhanh
        </h2>
        <div class="quick-actions-grid">
          <div *ngFor="let action of quickActions" class="quick-action-card">
            <div class="action-icon" [style.background-color]="action.color">
              <i [class]="action.icon"></i>
            </div>
            <div class="action-content">
              <h3 class="action-title">{{ action.title }}</h3>
              <p class="action-description">{{ action.description }}</p>
              <button class="btn btn-primary btn-sm">{{ action.buttonText }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="recent-activities-section">
        <h2 class="section-title">
          <i class="fas fa-clock me-2"></i>
          Hoạt động gần đây
        </h2>
        <div class="activity-list">
          <div *ngFor="let activity of recentActivities" class="activity-item">
            <div class="activity-icon" [class]="'activity-' + activity.type">
              <i [class]="activity.icon"></i>
            </div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-description">{{ activity.description }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Status -->
      <div class="system-status-section">
        <h2 class="section-title">
          <i class="fas fa-server me-2"></i>
          Trạng thái hệ thống
        </h2>
        <div class="status-grid">
          <div *ngFor="let status of systemStatus" class="status-item">
            <div class="status-indicator" [class]="status.status"></div>
            <div class="status-label">{{ status.label }}</div>
            <div class="status-value">{{ status.value }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  Math = Math; // Make Math available in template

  stats = [
    {
      type: 'users',
      icon: 'fas fa-users',
      value: '2,847',
      label: 'Tổng người dùng',
      change: 12.5
    },
    {
      type: 'packages',
      icon: 'fas fa-box',
      value: '156',
      label: 'Gói đã bán',
      change: 8.2
    },
    {
      type: 'revenue',
      icon: 'fas fa-dollar-sign',
      value: '₫45.2M',
      label: 'Doanh thu tháng',
      change: 15.8
    },
    {
      type: 'features',
      icon: 'fas fa-cogs',
      value: '24',
      label: 'Tính năng active',
      change: -2.1
    }
  ];

  quickActions = [
    {
      title: 'Thêm người dùng mới',
      description: 'Tạo tài khoản người dùng mới cho hệ thống',
      icon: 'fas fa-user-plus',
      color: '#007bff',
      buttonText: 'Thêm ngay'
    },
    {
      title: 'Tạo gói dịch vụ',
      description: 'Thiết lập gói dịch vụ mới với các tính năng',
      icon: 'fas fa-plus-circle',
      color: '#28a745',
      buttonText: 'Tạo gói'
    },
    {
      title: 'Xem báo cáo',
      description: 'Kiểm tra báo cáo doanh thu và thống kê',
      icon: 'fas fa-chart-bar',
      color: '#ffc107',
      buttonText: 'Xem ngay'
    },
    {
      title: 'Cài đặt hệ thống',
      description: 'Cấu hình các thiết lập hệ thống',
      icon: 'fas fa-cog',
      color: '#6c757d',
      buttonText: 'Cài đặt'
    }
  ];

  recentActivities = [
    {
      type: 'user',
      icon: 'fas fa-user',
      title: 'Người dùng mới đăng ký',
      description: 'nguyenvana@email.com đã đăng ký gói Premium',
      time: '5 phút trước'
    },
    {
      type: 'package',
      icon: 'fas fa-box',
      title: 'Gói dịch vụ được mua',
      description: 'Gói Business được mua bởi Công ty ABC',
      time: '15 phút trước'
    },
    {
      type: 'system',
      icon: 'fas fa-cog',
      title: 'Cập nhật tính năng',
      description: 'Tính năng "Export PDF" đã được kích hoạt',
      time: '1 giờ trước'
    },
    {
      type: 'report',
      icon: 'fas fa-file-alt',
      title: 'Báo cáo được tạo',
      description: 'Báo cáo doanh thu tháng 12/2024 hoàn thành',
      time: '2 giờ trước'
    }
  ];

  systemStatus = [
    {
      label: 'API Server',
      value: 'Online',
      status: 'healthy'
    },
    {
      label: 'Database',
      value: '99.9% uptime',
      status: 'healthy'
    },
    {
      label: 'Email Service',
      value: 'Active',
      status: 'healthy'
    },
    {
      label: 'Backup System',
      value: 'Last: 2 hours ago',
      status: 'warning'
    }
  ];

  ngOnInit() {
    // Load dashboard data
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Implement API calls to load real dashboard data
    console.log('Loading dashboard data...');
  }
} 