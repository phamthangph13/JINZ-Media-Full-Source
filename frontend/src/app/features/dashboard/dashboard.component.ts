import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <div class="dashboard-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-content">
        <h1 class="page-title">
            <i class="fas fa-tachometer-alt"></i>
            Dashboard
        </h1>
          <p class="page-description">Chào mừng bạn đến với bảng điều khiển JINZ Media</p>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon users">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalUsers }}</h3>
            <p>Tổng người dùng</p>
            <span class="stat-change positive">+12%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon packages">
            <i class="fas fa-box"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalPackages }}</h3>
            <p>Gói dịch vụ</p>
            <span class="stat-change positive">+8%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon revenue">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalRevenue | currency:'VND':'symbol':'1.0-0' }}</h3>
            <p>Doanh thu</p>
            <span class="stat-change positive">+15%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon active">
            <i class="fas fa-chart-line"></i>
            </div>
          <div class="stat-content">
            <h3>{{ stats.activeSubscriptions }}</h3>
            <p>Gói đang hoạt động</p>
            <span class="stat-change positive">+5%</span>
          </div>
        </div>
      </div>

      <!-- Charts and Data -->
      <div class="dashboard-grid">
        <!-- Recent Users -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>
              <i class="fas fa-user-plus"></i>
              Người dùng mới
            </h3>
            <a routerLink="/admin/users/list" class="btn btn-sm btn-outline-primary">
              Xem tất cả
            </a>
          </div>
          <div class="card-body">
            <div class="user-list">
              <div class="user-item" *ngFor="let user of recentUsers">
                <div class="user-avatar">
                  <img [src]="user.avatar || '/assets/images/default-avatar.png'" 
                       [alt]="user.name"
                       (error)="onImageError($event)">
                </div>
                <div class="user-info">
                  <h4>{{ user.name }}</h4>
                  <p>{{ user.email }}</p>
                  <span class="user-role" [class]="user.role">{{ user.role }}</span>
                </div>
                <div class="user-date">
                  <small>{{ formatDate(user.createdAt) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Chart -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>
              <i class="fas fa-chart-area"></i>
              Doanh thu theo tháng
            </h3>
            <select class="form-select form-select-sm" [(ngModel)]="selectedYear">
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="revenueChart" width="400" height="200"></canvas>
            </div>
          </div>
        </div>

        <!-- Package Usage -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>
              <i class="fas fa-box-open"></i>
              Gói dịch vụ phổ biến
            </h3>
          </div>
          <div class="card-body">
            <div class="package-list">
              <div class="package-item" *ngFor="let package of popularPackages">
                <div class="package-info">
                  <h4>{{ package.name }}</h4>
                  <p>{{ package.description }}</p>
                </div>
                <div class="package-stats">
                  <div class="package-users">
                    <i class="fas fa-users"></i>
                    {{ package.userCount }}
                  </div>
                  <div class="package-revenue">
                    <i class="fas fa-dollar-sign"></i>
                    {{ package.revenue | currency:'VND':'symbol':'1.0-0' }}
        </div>
      </div>
            </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>
              <i class="fas fa-rocket"></i>
              Thao tác nhanh
            </h3>
          </div>
          <div class="card-body">
            <div class="quick-actions">
              <button class="action-btn" routerLink="/admin/users/list">
                <i class="fas fa-user-plus"></i>
                <span>Thêm người dùng</span>
              </button>
              <button class="action-btn" routerLink="/admin/packages">
                <i class="fas fa-box"></i>
                <span>Quản lý gói</span>
              </button>
              <button class="action-btn" routerLink="/admin/reports">
                <i class="fas fa-chart-bar"></i>
                <span>Báo cáo</span>
              </button>
              <button class="action-btn" routerLink="/admin/features">
                <i class="fas fa-cogs"></i>
                <span>Tính năng</span>
              </button>
      </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1.5rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .page-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 15px;
      padding: 2rem;
      margin-bottom: 2rem;
      color: white;
    }

    .page-header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .page-description {
      margin: 0.5rem 0 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
    }

    .stat-icon.users {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .stat-icon.packages {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .stat-icon.revenue {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .stat-icon.active {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .stat-content h3 {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0;
      color: #333;
    }

    .stat-content p {
      margin: 0.25rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .stat-change {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
    }

    .stat-change.positive {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .dashboard-card {
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .card-body {
      padding: 1.5rem;
    }

    .user-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .user-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      background: #f8f9fa;
      transition: all 0.3s ease;
    }

    .user-item:hover {
      background: #e9ecef;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-info {
      flex: 1;
    }

    .user-info h4 {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 600;
      color: #333;
    }

    .user-info p {
      margin: 0.25rem 0;
      font-size: 0.8rem;
      color: #666;
    }

    .user-role {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: 500;
    }

    .user-role.admin {
      background: #e3f2fd;
      color: #1976d2;
    }

    .user-role.user {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .user-date {
      font-size: 0.8rem;
      color: #666;
    }

    .package-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .package-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-radius: 8px;
      background: #f8f9fa;
      transition: all 0.3s ease;
    }

    .package-item:hover {
      background: #e9ecef;
    }

    .package-info h4 {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 600;
      color: #333;
    }

    .package-info p {
      margin: 0.25rem 0;
      font-size: 0.8rem;
      color: #666;
    }

    .package-stats {
      display: flex;
      gap: 1rem;
    }

    .package-users, .package-revenue {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8rem;
      color: #666;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      background: white;
      color: #666;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .action-btn:hover {
      border-color: #667eea;
      color: #667eea;
      background: #f8f9fa;
    }

    .action-btn i {
      font-size: 1.5rem;
    }

    .action-btn span {
      font-size: 0.9rem;
      font-weight: 500;
    }

    .chart-container {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 8px;
      color: #666;
      font-style: italic;
    }

    .form-select-sm {
      width: auto;
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
      border-radius: 6px;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }
      
      .page-header-content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = {
    totalUsers: 1250,
    totalPackages: 45,
    totalRevenue: 125000000,
    activeSubscriptions: 890
  };

  selectedYear = '2024';

  recentUsers = [
    {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@gmail.com',
      role: 'user',
      createdAt: new Date('2024-01-15'),
      avatar: null
    },
    {
      name: 'Trần Thị B',
      email: 'tranthib@gmail.com',
      role: 'admin',
      createdAt: new Date('2024-01-14'),
      avatar: null
    },
    {
      name: 'Lê Văn C',
      email: 'levanc@gmail.com',
      role: 'user',
      createdAt: new Date('2024-01-13'),
      avatar: null
    }
  ];

  popularPackages = [
    {
      name: 'Gói Premium',
      description: 'Gói dịch vụ cao cấp với đầy đủ tính năng',
      userCount: 450,
      revenue: 45000000
    },
    {
      name: 'Gói Standard',
      description: 'Gói dịch vụ tiêu chuẩn cho doanh nghiệp',
      userCount: 320,
      revenue: 25000000
    },
    {
      name: 'Gói Basic',
      description: 'Gói dịch vụ cơ bản cho cá nhân',
      userCount: 280,
      revenue: 12000000
    }
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // TODO: Load real data from API
    console.log('Loading dashboard data...');
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  onImageError(event: any): void {
    event.target.src = '/assets/images/default-avatar.png';
  }
} 