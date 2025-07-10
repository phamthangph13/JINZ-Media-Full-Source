import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { User, CreateUserRequest, UpdateUserRequest, UserStats } from '../models/user.model';

@Component({
    selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, NgxPaginationModule],
  providers: [UserService],
    template: `
    <div class="user-management-container">
      <!-- Header with Statistics -->
      <div class="page-header">
        <div class="header-content">
        <h1 class="page-title">
            <i class="fas fa-users"></i>
            Quản lý người dùng
        </h1>
          <button 
            class="btn btn-primary add-user-btn"
            (click)="openAddUserModal()"
            [disabled]="isLoading">
            <i class="fas fa-plus"></i>
          Thêm người dùng
        </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid" *ngIf="userStats">
        <div class="stat-card">
          <div class="stat-icon bg-primary">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <h3>{{ userStats.totalUsers }}</h3>
            <p>Tổng người dùng</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-success">
            <i class="fas fa-user-check"></i>
          </div>
          <div class="stat-content">
            <h3>{{ userStats.activeUsers }}</h3>
            <p>Người dùng hoạt động</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-warning">
            <i class="fas fa-user-shield"></i>
          </div>
          <div class="stat-content">
            <h3>{{ userStats.adminUsers }}</h3>
            <p>Quản trị viên</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-info">
            <i class="fas fa-crown"></i>
          </div>
          <div class="stat-content">
            <h3>{{ userStats.subscribedUsers }}</h3>
            <p>Người dùng đã đăng ký</p>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="search-container">
          <div class="search-input-wrapper">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              class="form-control search-input"
              placeholder="Tìm kiếm theo tên, email..."
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              [disabled]="isLoading">
          </div>
        </div>
        <div class="filter-buttons">
          <button 
            class="btn filter-btn"
            [class.active]="activeFilter === 'all'"
            (click)="setFilter('all')"
            [disabled]="isLoading">
            <i class="fas fa-users"></i>
            Tất cả
          </button>
          <button 
            class="btn filter-btn"
            [class.active]="activeFilter === 'active'"
            (click)="setFilter('active')"
            [disabled]="isLoading">
            <i class="fas fa-user-check"></i>
            Hoạt động
          </button>
          <button 
            class="btn filter-btn"
            [class.active]="activeFilter === 'inactive'"
            (click)="setFilter('inactive')"
            [disabled]="isLoading">
            <i class="fas fa-user-times"></i>
            Không hoạt động
          </button>
          <button 
            class="btn filter-btn"
            [class.active]="activeFilter === 'admin'"
            (click)="setFilter('admin')"
            [disabled]="isLoading">
            <i class="fas fa-user-shield"></i>
            Admin
          </button>
        </div>
      </div>
      
      <!-- Users Table -->
      <div class="table-container">
        <div class="table-header">
          <h5>
            <i class="fas fa-list"></i>
            Danh sách người dùng
            <span class="user-count" *ngIf="totalUsers > 0">({{ totalUsers }})</span>
          </h5>
        </div>

        <div *ngIf="isLoading" class="loading-spinner">
          <div class="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>

        <div *ngIf="!isLoading && users.length === 0" class="empty-state">
          <i class="fas fa-users fa-3x"></i>
          <h4>Không có người dùng nào</h4>
          <p>Chưa có người dùng nào trong hệ thống</p>
          <button class="btn btn-primary" (click)="openAddUserModal()">
            <i class="fas fa-plus"></i>
            Thêm người dùng đầu tiên
          </button>
        </div>

        <div class="table-responsive" *ngIf="!isLoading && users.length > 0">
          <table class="table users-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Gói đăng ký</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users" class="user-row">
                <td>
                  <div class="user-info">
                    <div class="user-avatar">
                      <img *ngIf="user.avatar" [src]="user.avatar" [alt]="user.name">
                      <div *ngIf="!user.avatar" class="avatar-placeholder">
                        {{ getInitials(user.name) }}
                      </div>
                    </div>
                    <div class="user-details">
                      <h6>{{ user.name }}</h6>
                      <small *ngIf="user.phone">{{ user.phone }}</small>
                      <small *ngIf="user.lastLogin" class="text-muted">
                        Lần cuối: {{ formatDate(user.lastLogin) }}
                      </small>
                    </div>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="role-badge" [class.admin]="user.role === 'admin'">
                    <i class="fas" [class.fa-user-shield]="user.role === 'admin'" [class.fa-user]="user.role === 'user'"></i>
                    {{ user.role === 'admin' ? 'Quản trị viên' : 'Người dùng' }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" [class.active]="user.isActive">
                    <i class="fas" [class.fa-circle]="user.isActive" [class.fa-times-circle]="!user.isActive"></i>
                    {{ user.isActive ? 'Hoạt động' : 'Tạm khóa' }}
                  </span>
                </td>
                <td>
                  <div class="subscription-info">
                    <span *ngIf="user.subscription?.isActive" class="subscription-badge active">
                      <i class="fas fa-crown"></i>
                      {{ user.subscription?.isLifetime ? 'Trọn đời' : 'Có gói' }}
                    </span>
                    <span *ngIf="!user.subscription?.isActive" class="subscription-badge inactive">
                      <i class="fas fa-times"></i>
                      Chưa đăng ký
                    </span>
                  </div>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <div class="action-buttons">
                    <button 
                      class="btn btn-sm btn-outline-primary"
                      (click)="editUser(user)"
                      [disabled]="isLoading"
                      title="Chỉnh sửa">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-warning"
                      (click)="toggleUserStatus(user)"
                      [disabled]="isLoading"
                      [title]="user.isActive ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'">
                      <i class="fas" [class.fa-lock]="user.isActive" [class.fa-unlock]="!user.isActive"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-danger"
                      (click)="deleteUser(user)"
                      [disabled]="isLoading"
                      title="Xóa">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-container" *ngIf="totalUsers > pageSize">
          <pagination-controls 
            (pageChange)="onPageChange($event)"
            [responsive]="true"
            previousLabel="Trước"
            nextLabel="Sau"
            screenReaderPaginationLabel="Phân trang"
            screenReaderPageLabel="Trang"
            screenReaderCurrentLabel="Trang hiện tại">
          </pagination-controls>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h5>
            <i class="fas" [class.fa-plus]="!editingUser" [class.fa-edit]="editingUser"></i>
            {{ editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới' }}
          </h5>
          <button class="btn-close" (click)="closeModal()" [disabled]="isSubmitting">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form [formGroup]="userForm" (ngSubmit)="saveUser()">
            <div class="form-group">
              <label for="name">Họ và tên *</label>
              <input 
                type="text" 
                id="name"
                class="form-control"
                formControlName="name"
                [class.is-invalid]="userForm.get('name')?.invalid && userForm.get('name')?.touched"
                [disabled]="isSubmitting">
              <div *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched" class="invalid-feedback">
                Vui lòng nhập họ và tên
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input 
                type="email" 
                id="email"
                class="form-control"
                formControlName="email"
                [class.is-invalid]="userForm.get('email')?.invalid && userForm.get('email')?.touched"
                [disabled]="isSubmitting">
              <div *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched" class="invalid-feedback">
                Vui lòng nhập email hợp lệ
              </div>
            </div>

            <div class="form-group" *ngIf="!editingUser">
              <label for="password">Mật khẩu *</label>
              <input 
                type="password" 
                id="password"
                class="form-control"
                formControlName="password"
                [class.is-invalid]="userForm.get('password')?.invalid && userForm.get('password')?.touched"
                [disabled]="isSubmitting">
              <div *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched" class="invalid-feedback">
                Mật khẩu phải có ít nhất 6 ký tự
              </div>
            </div>

            <div class="form-group">
              <label for="phone">Số điện thoại</label>
              <input 
                type="tel" 
                id="phone"
                class="form-control"
                formControlName="phone"
                [disabled]="isSubmitting">
            </div>

            <div class="form-group">
              <label for="role">Vai trò *</label>
              <select 
                id="role"
                class="form-control"
                formControlName="role"
                [disabled]="isSubmitting">
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>

            <div class="form-group">
              <div class="form-check">
                <input 
                  type="checkbox" 
                  id="isActive"
                  class="form-check-input"
                  formControlName="isActive"
                  [disabled]="isSubmitting">
                <label class="form-check-label" for="isActive">
                  Tài khoản hoạt động
                </label>
              </div>
            </div>
          </form>
        </div>
        
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary" 
            (click)="closeModal()"
            [disabled]="isSubmitting">
            Hủy
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            (click)="saveUser()"
            [disabled]="isSubmitting || userForm.invalid">
            <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
            {{ editingUser ? 'Cập nhật' : 'Thêm mới' }}
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .user-management-container {
      padding: 0;
      max-width: 100%;
    }
    
    .page-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem 0;
      margin-bottom: 2rem;
      border-radius: 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .page-title {
      font-size: 2rem;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .page-title i {
      font-size: 1.5rem;
    }

    .add-user-btn {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .add-user-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding: 0 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
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

    .stat-icon.bg-primary { background: #667eea; }
    .stat-icon.bg-success { background: #56c596; }
    .stat-icon.bg-warning { background: #f6ad55; }
    .stat-icon.bg-info { background: #4fd1c7; }

    .stat-content h3 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      color: #333;
    }

    .stat-content p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .filters-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin: 0 2rem 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-container {
      flex: 1;
      min-width: 300px;
    }

    .search-input-wrapper {
      position: relative;
    }

    .search-input-wrapper i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }

    .search-input {
      padding-left: 2.5rem;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      height: 45px;
    }

    .search-input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }

    .filter-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #e0e0e0;
      background: white;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .filter-btn:hover {
      background: #f8f9fa;
      border-color: #667eea;
    }

    .filter-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .table-container {
      background: white;
      border-radius: 12px;
      margin: 0 2rem 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .table-header {
      background: #f8f9fa;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .table-header h5 {
      margin: 0;
      color: #333;
      font-weight: 600;
    }

    .user-count {
      color: #666;
      font-weight: 400;
    }

    .loading-spinner {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .empty-state i {
      color: #ccc;
      margin-bottom: 1rem;
    }

    .empty-state h4 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .users-table {
      margin: 0;
    }

    .users-table th {
      background: #f8f9fa;
      border: none;
      padding: 1rem;
      font-weight: 600;
      color: #333;
    }

    .users-table td {
      padding: 1rem;
      border-top: 1px solid #e0e0e0;
      vertical-align: middle;
    }

    .user-row:hover {
      background: #f8f9fa;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-placeholder {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: #667eea;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .user-details h6 {
      margin: 0;
      font-weight: 600;
      color: #333;
    }

    .user-details small {
      display: block;
      color: #666;
      margin-top: 0.25rem;
    }

    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
      background: #e3f2fd;
      color: #1976d2;
    }

    .role-badge.admin {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
      background: #ffebee;
      color: #d32f2f;
    }

    .status-badge.active {
      background: #e8f5e8;
      color: #388e3c;
    }

    .subscription-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
      background: #ffebee;
      color: #d32f2f;
    }

    .subscription-badge.active {
      background: #fff3e0;
      color: #f57c00;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .action-buttons .btn {
      padding: 0.375rem 0.75rem;
      border-radius: 6px;
    }

    .pagination-container {
      padding: 1.5rem;
      border-top: 1px solid #e0e0e0;
      background: #f8f9fa;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .modal-header h5 {
      margin: 0;
      color: #333;
      font-weight: 600;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      color: #666;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: background 0.3s ease;
    }

    .btn-close:hover {
      background: #f8f9fa;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.9rem;
    }

    .form-control:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #dc3545;
    }

    .form-check {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-check-input {
      width: 1.25rem;
      height: 1.25rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1.5rem;
      border-top: 1px solid #e0e0e0;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      text-decoration: none;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .btn-primary:hover {
      background: #5a6fd8;
      border-color: #5a6fd8;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      border-color: #6c757d;
    }

    .btn-secondary:hover {
      background: #5a6268;
      border-color: #5a6268;
    }

    .btn:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .filters-section {
        flex-direction: column;
        align-items: stretch;
      }

      .search-container {
        min-width: auto;
      }

      .filter-buttons {
        justify-content: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .table-responsive {
        font-size: 0.875rem;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  userStats: UserStats | null = null;
  totalUsers = 0;
  currentPage = 1;
  pageSize = 10;
  searchQuery = '';
  activeFilter = 'all';
  isLoading = false;
  showModal = false;
  editingUser: User | null = null;
  isSubmitting = false;
  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      role: ['user', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadUserStats();
  }

  loadUsers(): void {
    this.isLoading = true;
    const filters: any = {
      page: this.currentPage,
      limit: this.pageSize,
      sort: '-createdAt'
    };

    if (this.searchQuery) {
      filters.search = this.searchQuery;
    }

    if (this.activeFilter !== 'all') {
      switch (this.activeFilter) {
        case 'active':
          filters.isActive = true;
          break;
        case 'inactive':
          filters.isActive = false;
          break;
        case 'admin':
          filters.role = 'admin';
          break;
      }
    }

    this.userService.getUsers(filters).subscribe({
      next: (response) => {
        this.users = response.data;
        this.totalUsers = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toastr.error('Không thể tải danh sách người dùng');
        this.isLoading = false;
      }
    });
  }

  loadUserStats(): void {
    this.userService.getUserStats().subscribe({
      next: (stats) => {
        this.userStats = stats;
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  openAddUserModal(): void {
    this.editingUser = null;
    this.userForm.reset({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'user',
      isActive: true
    });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      isActive: user.isActive
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
    this.userForm.reset();
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.userForm.value;

    if (this.editingUser) {
      // Update user
      const updateData: UpdateUserRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive
      };

      this.userService.updateUser(this.editingUser._id, updateData).subscribe({
        next: () => {
          this.toastr.success('Cập nhật người dùng thành công');
          this.closeModal();
          this.loadUsers();
          this.loadUserStats();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.toastr.error('Không thể cập nhật người dùng');
          this.isSubmitting = false;
        }
      });
    } else {
      // Create user
      const createData: CreateUserRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive
      };

      this.userService.createUser(createData).subscribe({
        next: () => {
          this.toastr.success('Thêm người dùng thành công');
          this.closeModal();
          this.loadUsers();
          this.loadUserStats();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.toastr.error('Không thể thêm người dùng');
          this.isSubmitting = false;
        }
      });
    }
  }

  toggleUserStatus(user: User): void {
    const action = user.isActive ? 'khóa' : 'kích hoạt';
    const icon = user.isActive ? 'warning' : 'success';
    
    Swal.fire({
      title: `Xác nhận ${action}`,
      text: `Bạn có chắc chắn muốn ${action} tài khoản "${user.name}"?`,
      icon: icon,
      showCancelButton: true,
      confirmButtonText: `Đồng ý ${action}`,
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.toggleUserStatus(user._id).subscribe({
          next: () => {
            this.toastr.success(`${action.charAt(0).toUpperCase() + action.slice(1)} tài khoản thành công`);
            this.loadUsers();
            this.loadUserStats();
          },
          error: (error) => {
            console.error('Error toggling user status:', error);
            this.toastr.error(`Không thể ${action} tài khoản`);
          }
        });
      }
    });
  }

  deleteUser(user: User): void {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: `Bạn có chắc chắn muốn xóa người dùng "${user.name}"? Hành động này không thể hoàn tác.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user._id).subscribe({
          next: () => {
            this.toastr.success('Xóa người dùng thành công');
            this.loadUsers();
            this.loadUserStats();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.toastr.error('Không thể xóa người dùng');
          }
        });
      }
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
} 