import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PackageService } from '../services/package.service';
import { Package, CreatePackageRequest, UpdatePackageRequest } from '../models/package.model';
import { PackageFormComponent } from '../components/package-form.component';
import { AuthService } from '../../../core/services/auth.service';
import { AuthRequiredComponent } from '../../../shared/components/auth-required.component';

@Component({
    selector: 'app-package-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PackageFormComponent, AuthRequiredComponent],
    template: `
    <!-- Auth Required Component -->
    <app-auth-required *ngIf="!isAuthenticated"></app-auth-required>
    
    <!-- Main Content -->
    <div class="package-management-container" *ngIf="isAuthenticated">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="page-title mb-1">
            <i class="fas fa-boxes me-3 text-primary"></i>
            Quản lý gói dịch vụ
      </h1>
          <p class="text-muted mb-0">Quản lý các gói dịch vụ và tính năng</p>
        </div>
        <button 
          class="btn btn-primary"
          (click)="showAddForm()"
          [disabled]="loading">
          <i class="fas fa-plus me-2"></i>
          Thêm gói mới
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4" *ngIf="!showForm">
        <div class="col-md-3">
          <div class="stats-card">
            <div class="stats-icon bg-primary">
              <i class="fas fa-boxes"></i>
            </div>
            <div class="stats-content">
              <div class="stats-number">{{ packages.length }}</div>
              <div class="stats-label">Tổng gói</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stats-card">
            <div class="stats-icon bg-success">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stats-content">
              <div class="stats-number">{{ getActivePackagesCount() }}</div>
              <div class="stats-label">Gói hoạt động</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stats-card">
            <div class="stats-icon bg-warning">
              <i class="fas fa-star"></i>
            </div>
            <div class="stats-content">
              <div class="stats-number">{{ getPopularPackagesCount() }}</div>
              <div class="stats-label">Gói phổ biến</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stats-card">
            <div class="stats-icon bg-info">
              <i class="fas fa-users"></i>
            </div>
            <div class="stats-content">
              <div class="stats-number">{{ getTotalSubscribers() }}</div>
              <div class="stats-label">Tổng đăng ký</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Package Form (Add/Edit) -->
      <div class="card mb-4" *ngIf="showForm">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-{{ editMode ? 'edit' : 'plus' }} me-2"></i>
            {{ editMode ? 'Chỉnh sửa gói' : 'Thêm gói mới' }}
          </h5>
        </div>
        <div class="card-body">
          <app-package-form
            [packageData]="selectedPackage"
            [editMode]="editMode"
            [loading]="formLoading"
            (formSubmit)="onFormSubmit($event)"
            (formCancel)="hideForm()">
          </app-package-form>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="card mb-4" *ngIf="!showForm">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="fas fa-search"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control"
                  [(ngModel)]="searchTerm"
                  (input)="filterPackages()"
                  placeholder="Tìm kiếm gói...">
              </div>
            </div>
            <div class="col-md-2">
              <select 
                class="form-select"
                [(ngModel)]="filterType"
                (change)="filterPackages()">
                <option value="">Tất cả loại</option>
                <option value="monthly">Hàng tháng</option>
                <option value="yearly">Hàng năm</option>
                <option value="lifetime">Trọn đời</option>
              </select>
            </div>
            <div class="col-md-2">
              <select 
                class="form-select"
                [(ngModel)]="filterStatus"
                (change)="filterPackages()">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
            <div class="col-md-2">
              <select 
                class="form-select"
                [(ngModel)]="sortBy"
                (change)="sortPackages()">
                <option value="createdAt">Ngày tạo</option>
                <option value="name">Tên gói</option>
                <option value="price">Giá</option>
                <option value="displayOrder">Thứ tự</option>
              </select>
            </div>
            <div class="col-md-2">
              <button 
                class="btn btn-outline-secondary w-100"
                (click)="refreshPackages()">
                <i class="fas fa-sync-alt me-1"></i>
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="text-center py-5" *ngIf="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải danh sách gói...</p>
      </div>

      <!-- Packages Grid -->
      <div class="row" *ngIf="!loading && !showForm">
        <div class="col-lg-4 col-md-6 mb-4" *ngFor="let package of filteredPackages">
          <div class="package-card" [class.popular]="package.isPopular">
            <!-- Popular Badge -->
            <div class="popular-badge" *ngIf="package.isPopular">
              <i class="fas fa-star"></i>
              Phổ biến
            </div>

            <!-- Package Image -->
            <div class="package-image">
              <img 
                [src]="getImageUrl(package.image)" 
                [alt]="package.name"
                *ngIf="package.image"
                class="img-fluid">
              <div class="no-image" *ngIf="!package.image">
                <i class="fas fa-image"></i>
              </div>
            </div>

            <!-- Package Content -->
            <div class="package-content">
              <div class="package-header">
                <h5 class="package-name">{{ package.name }}</h5>
                <div class="package-type-badge" [class]="'type-' + package.type">
                  {{ formatPackageType(package.type) }}
                </div>
              </div>

              <p class="package-description" *ngIf="package.description">
                {{ package.description }}
              </p>

              <!-- Price -->
              <div class="package-price">
                <div class="current-price">
                  {{ formatPrice(package.price, package.currency) }}
                </div>
                <div class="original-price" *ngIf="package.originalPrice && package.originalPrice > package.price">
                  {{ formatPrice(package.originalPrice, package.currency) }}
                </div>
              </div>

              <!-- Duration -->
              <div class="package-duration" *ngIf="package.duration">
                <i class="fas fa-clock me-1"></i>
                {{ package.duration.value }} {{ formatDurationUnit(package.duration.unit) }}
              </div>

              <!-- Features Count -->
              <div class="package-features">
                <i class="fas fa-star me-1"></i>
                {{ package.features.length }} tính năng
              </div>

              <!-- Status -->
              <div class="package-status">
                <span class="status-badge" [class]="package.isActive ? 'status-active' : 'status-inactive'">
                  <i class="fas fa-{{ package.isActive ? 'check-circle' : 'times-circle' }} me-1"></i>
                  {{ package.isActive ? 'Hoạt động' : 'Không hoạt động' }}
                </span>
              </div>

              <!-- Package Meta -->
              <div class="package-meta">
                <small class="text-muted">
                  <i class="fas fa-calendar me-1"></i>
                  {{ formatDate(package.createdAt) }}
                </small>
                <small class="text-muted" *ngIf="package.subscribersCount">
                  <i class="fas fa-users me-1"></i>
                  {{ package.subscribersCount }} đăng ký
                </small>
              </div>
            </div>

            <!-- Package Actions -->
            <div class="package-actions">
              <button 
                class="btn btn-sm btn-outline-primary"
                (click)="editPackage(package)"
                title="Chỉnh sửa">
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="btn btn-sm btn-outline-secondary"
                (click)="togglePackageStatus(package)"
                [title]="package.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'">
                <i class="fas fa-{{ package.isActive ? 'eye-slash' : 'eye' }}"></i>
              </button>
              <button 
                class="btn btn-sm btn-outline-danger"
                (click)="deletePackage(package)"
                title="Xóa">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && filteredPackages.length === 0 && !showForm">
        <div class="empty-icon">
          <i class="fas fa-boxes"></i>
        </div>
        <h4>{{ searchTerm || filterType || filterStatus ? 'Không tìm thấy gói nào' : 'Chưa có gói nào' }}</h4>
        <p class="text-muted">
          {{ searchTerm || filterType || filterStatus 
            ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm' 
            : 'Hãy tạo gói đầu tiên để bắt đầu' }}
        </p>
        <button 
          class="btn btn-primary"
          (click)="showAddForm()"
          *ngIf="!searchTerm && !filterType && !filterStatus">
          <i class="fas fa-plus me-2"></i>
          Tạo gói đầu tiên
        </button>
      </div>

      <!-- Error Message -->
      <div class="alert alert-danger" *ngIf="error">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error }}
        <button 
          type="button" 
          class="btn-close float-end"
          (click)="error = null">
        </button>
      </div>

      <!-- Success Message -->
      <div class="alert alert-success" *ngIf="successMessage">
        <i class="fas fa-check-circle me-2"></i>
        {{ successMessage }}
        <button 
          type="button" 
          class="btn-close float-end"
          (click)="successMessage = null">
        </button>
      </div>
    </div>
  `,
    styles: [`
    .package-management-container {
      padding: 1.5rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 600;
      color: #2c3e50;
    }

    /* Stats Cards */
    .stats-card {
      background: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stats-icon {
      width: 60px;
      height: 60px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
    }

    .stats-number {
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
    }

    .stats-label {
      font-size: 0.9rem;
      color: #6c757d;
    }

    /* Package Cards */
    .package-card {
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: all 0.3s ease;
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .package-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    }

    .package-card.popular {
      border: 2px solid #ffd700;
    }

    .popular-badge {
      position: absolute;
      top: 15px;
      right: 15px;
      background: linear-gradient(45deg, #ffd700, #ffed4e);
      color: #8b5a00;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      z-index: 2;
    }

    .package-image {
      height: 200px;
      overflow: hidden;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .package-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image {
      color: white;
      font-size: 3rem;
      opacity: 0.7;
    }

    .package-content {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .package-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .package-name {
      font-size: 1.3rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0;
      flex: 1;
      margin-right: 1rem;
    }

    .package-type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .type-monthly {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .type-yearly {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .type-lifetime {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .package-description {
      color: #6c757d;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .package-price {
      margin-bottom: 1rem;
    }

    .current-price {
      font-size: 1.8rem;
      font-weight: 700;
      color: #e74c3c;
    }

    .original-price {
      font-size: 1rem;
      color: #95a5a6;
      text-decoration: line-through;
    }

    .package-duration,
    .package-features {
      color: #6c757d;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .package-status {
      margin-bottom: 1rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status-active {
      background-color: #d4edda;
      color: #155724;
    }

    .status-inactive {
      background-color: #f8d7da;
      color: #721c24;
    }

    .package-meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .package-actions {
      padding: 1rem 1.5rem;
      background-color: #f8f9fa;
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 4rem;
      color: #dee2e6;
      margin-bottom: 1rem;
    }

    .empty-state h4 {
      color: #6c757d;
      margin-bottom: 1rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .package-management-container {
        padding: 1rem;
      }
      
      .page-title {
        font-size: 1.5rem;
      }
      
      .stats-card {
        padding: 1rem;
      }
      
      .stats-number {
        font-size: 1.5rem;
      }
    }
  `]
})
export class PackageListComponent implements OnInit {
  packages: Package[] = [];
  filteredPackages: Package[] = [];
  loading = false;
  formLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Form state
  showForm = false;
  editMode = false;
  selectedPackage: Package | null = null;

  // Filter state
  searchTerm = '';
  filterType = '';
  filterStatus = '';
  sortBy = 'createdAt';

  constructor(
    private packageService: PackageService,
    private authService: AuthService
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated() && this.authService.isAdmin();
  }

  ngOnInit() {
    this.loadPackages();
  }

  loadPackages() {
    this.loading = true;
    this.error = null;

    this.packageService.getPackages().subscribe({
      next: (packages) => {
        this.packages = packages;
        this.filterPackages();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  filterPackages() {
    let filtered = [...this.packages];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(pkg => 
        pkg.name.toLowerCase().includes(term) ||
        (pkg.description && pkg.description.toLowerCase().includes(term))
      );
    }

    // Type filter
    if (this.filterType) {
      filtered = filtered.filter(pkg => pkg.type === this.filterType);
    }

    // Status filter
    if (this.filterStatus) {
      const isActive = this.filterStatus === 'active';
      filtered = filtered.filter(pkg => pkg.isActive === isActive);
    }

    this.filteredPackages = filtered;
    this.sortPackages();
  }

  sortPackages() {
    this.filteredPackages.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'displayOrder':
          return a.displayOrder - b.displayOrder;
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }

  showAddForm() {
    this.showForm = true;
    this.editMode = false;
    this.selectedPackage = null;
  }

  editPackage(pkg: Package) {
    this.showForm = true;
    this.editMode = true;
    this.selectedPackage = pkg;
  }

  hideForm() {
    this.showForm = false;
    this.editMode = false;
    this.selectedPackage = null;
    this.clearMessages();
  }

  onFormSubmit(packageData: CreatePackageRequest) {
    this.formLoading = true;
    this.error = null;

    const operation = this.editMode && this.selectedPackage
      ? this.packageService.updatePackage(this.selectedPackage._id, packageData as UpdatePackageRequest)
      : this.packageService.createPackage(packageData);

    operation.subscribe({
      next: (result) => {
        this.formLoading = false;
        this.successMessage = this.editMode ? 'Cập nhật gói thành công!' : 'Tạo gói mới thành công!';
        this.hideForm();
        this.loadPackages();
        this.clearMessagesAfterDelay();
      },
      error: (error) => {
        this.formLoading = false;
        this.error = error.message;
      }
    });
  }

  togglePackageStatus(pkg: Package) {
    if (confirm(`Bạn có chắc muốn ${pkg.isActive ? 'vô hiệu hóa' : 'kích hoạt'} gói "${pkg.name}"?`)) {
      this.packageService.togglePackageStatus(pkg._id).subscribe({
        next: (updatedPackage) => {
          const index = this.packages.findIndex(p => p._id === pkg._id);
          if (index >= 0) {
            this.packages[index] = updatedPackage;
            this.filterPackages();
          }
          this.successMessage = `${pkg.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} gói thành công!`;
          this.clearMessagesAfterDelay();
        },
        error: (error) => {
          this.error = error.message;
        }
      });
    }
  }

  deletePackage(pkg: Package) {
    if (confirm(`Bạn có chắc muốn xóa gói "${pkg.name}"? Hành động này không thể hoàn tác.`)) {
      this.packageService.deletePackage(pkg._id).subscribe({
        next: () => {
          this.packages = this.packages.filter(p => p._id !== pkg._id);
          this.filterPackages();
          this.successMessage = 'Xóa gói thành công!';
          this.clearMessagesAfterDelay();
        },
        error: (error) => {
          this.error = error.message;
        }
      });
    }
  }

  refreshPackages() {
    this.searchTerm = '';
    this.filterType = '';
    this.filterStatus = '';
    this.sortBy = 'createdAt';
    this.loadPackages();
  }

  // Utility methods
  formatPrice(price: number, currency: string): string {
    return this.packageService.formatPrice(price, currency);
  }

  formatPackageType(type: string): string {
    return this.packageService.formatPackageType(type);
  }

  formatDurationUnit(unit: string): string {
    const unitMap: { [key: string]: string } = {
      'days': 'ngày',
      'months': 'tháng', 
      'years': 'năm'
    };
    return unitMap[unit] || unit;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('vi-VN');
  }

  getImageUrl(imagePath?: string): string {
    if (!imagePath) return 'assets/images/default-package.png';
    return `http://localhost:5000/${imagePath}`;
  }

  getActivePackagesCount(): number {
    return this.packages.filter(pkg => pkg.isActive).length;
  }

  getPopularPackagesCount(): number {
    return this.packages.filter(pkg => pkg.isPopular).length;
  }

  getTotalSubscribers(): number {
    return this.packages.reduce((total, pkg) => total + (pkg.subscribersCount || 0), 0);
  }

  clearMessages() {
    this.error = null;
    this.successMessage = null;
  }

  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.clearMessages();
    }, 5000);
  }
} 