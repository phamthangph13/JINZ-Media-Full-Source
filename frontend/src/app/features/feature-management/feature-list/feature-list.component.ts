import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ServiceService } from '../services/service.service';
import { Service, CreateServiceRequest, UpdateServiceRequest, SERVICE_TYPES } from '../models/service.model';
import { ServiceFormComponent } from '../components/service-form.component';
import { AuthService } from '../../../core/services/auth.service';
import { AuthRequiredComponent } from '../../../shared/components/auth-required.component';

@Component({
    selector: 'app-feature-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ServiceFormComponent, AuthRequiredComponent],
    template: `
    <!-- Auth Required Component -->
    <app-auth-required *ngIf="!isAuthenticated"></app-auth-required>
    
    <!-- Main Content -->
    <div class="service-management-container" *ngIf="isAuthenticated">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="page-title mb-1">
            <i class="fas fa-cogs me-3 text-primary"></i>
            Quản lý dịch vụ
      </h1>
          <p class="text-muted mb-0">Quản lý các dịch vụ và tính năng hệ thống</p>
        </div>
        <button 
          class="btn btn-primary"
          (click)="showAddForm()"
          [disabled]="loading">
          <i class="fas fa-plus me-2"></i>
          Thêm dịch vụ mới
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4" *ngIf="!showForm">
        <div class="col-md-3">
          <div class="stats-card">
            <div class="stats-icon bg-primary">
              <i class="fas fa-cogs"></i>
            </div>
            <div class="stats-content">
              <div class="stats-number">{{ services.length }}</div>
              <div class="stats-label">Tổng dịch vụ</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stats-card">
            <div class="stats-icon bg-success">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stats-content">
              <div class="stats-number">{{ getActiveServicesCount() }}</div>
              <div class="stats-label">Đang hoạt động</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stats-card">
            <div class="stats-icon bg-info">
              <i class="fas fa-layer-group"></i>
            </div>
            <div class="stats-content">
              <div class="stats-number">{{ getUniqueCategories() }}</div>
              <div class="stats-label">Danh mục</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stats-card">
            <div class="stats-icon bg-warning">
              <i class="fas fa-star"></i>
            </div>
            <div class="stats-content">
              <div class="stats-number">{{ getPremiumServicesCount() }}</div>
              <div class="stats-label">Premium</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Form (Add/Edit) -->
      <div class="card mb-4" *ngIf="showForm">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-{{ editMode ? 'edit' : 'plus' }} me-2"></i>
            {{ editMode ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới' }}
          </h5>
        </div>
        <div class="card-body">
          <app-service-form
            [serviceData]="selectedService"
            [editMode]="editMode"
            [loading]="formLoading"
            (formSubmit)="onFormSubmit($event)"
            (formCancel)="hideForm()">
          </app-service-form>
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
                  (input)="filterServices()"
                  placeholder="Tìm kiếm dịch vụ...">
              </div>
            </div>
            <div class="col-md-2">
              <select 
                class="form-select"
                [(ngModel)]="filterType"
                (change)="filterServices()">
                <option value="">Tất cả loại</option>
                <option *ngFor="let type of serviceTypes" [value]="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <select 
                class="form-select"
                [(ngModel)]="filterCategory"
                (change)="filterServices()">
                <option value="">Tất cả danh mục</option>
                <option *ngFor="let category of uniqueCategories" [value]="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <select 
                class="form-select"
                [(ngModel)]="filterStatus"
                (change)="filterServices()">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
            <div class="col-md-2">
              <button 
                class="btn btn-outline-secondary w-100"
                (click)="refreshServices()">
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
        <p class="mt-2 text-muted">Đang tải danh sách dịch vụ...</p>
      </div>

      <!-- Services Grid -->
      <div class="row" *ngIf="!loading && !showForm">
        <div class="col-lg-4 col-md-6 mb-4" *ngFor="let service of filteredServices">
          <div class="service-card" [class]="'type-' + service.type">
            <!-- Service Image -->
            <div class="service-image">
              <img 
                [src]="getFileUrl(service.image)" 
                [alt]="service.name"
                *ngIf="service.image"
                class="img-fluid">
              <div class="no-image" *ngIf="!service.image">
                <i class="fas fa-cog"></i>
              </div>
              
              <!-- Service Type Badge -->
              <div class="service-type-badge" [style.background-color]="getServiceTypeColor(service.type)">
                {{ formatServiceType(service.type) }}
              </div>
            </div>

            <!-- Service Content -->
            <div class="service-content">
              <div class="service-header">
                <h5 class="service-name">{{ service.name }}</h5>
                <div class="service-category">
                  <i class="fas fa-tag me-1"></i>
                  {{ service.category }}
                </div>
              </div>

              <p class="service-description" *ngIf="service.description">
                {{ service.description }}
              </p>

              <!-- Permission -->
              <div class="service-permission">
                <i class="fas fa-key me-1"></i>
                <code>{{ service.permission }}</code>
              </div>

              <!-- Media Files -->
              <div class="service-media" *ngIf="service.image || service.tutorialVideo">
                <div class="media-indicators">
                  <span class="media-indicator" *ngIf="service.image" title="Có hình ảnh">
                    <i class="fas fa-image"></i>
                  </span>
                  <span class="media-indicator" *ngIf="service.tutorialVideo" title="Có video hướng dẫn">
                    <i class="fas fa-video"></i>
                  </span>
                </div>
              </div>

              <!-- Metadata -->
              <div class="service-metadata" *ngIf="service.metadata && hasMetadata(service.metadata)">
                <div class="metadata-count">
                  <i class="fas fa-tags me-1"></i>
                  {{ getMetadataCount(service.metadata) }} metadata
                </div>
              </div>

              <!-- Status -->
              <div class="service-status">
                <span class="status-badge" [class]="service.isActive ? 'status-active' : 'status-inactive'">
                  <i class="fas fa-{{ service.isActive ? 'check-circle' : 'times-circle' }} me-1"></i>
                  {{ service.isActive ? 'Hoạt động' : 'Không hoạt động' }}
                </span>
              </div>

              <!-- Service Meta -->
              <div class="service-meta">
                <small class="text-muted">
                  <i class="fas fa-calendar me-1"></i>
                  {{ formatDate(service.createdAt) }}
                </small>
                <small class="text-muted" *ngIf="service.updatedAt !== service.createdAt">
                  <i class="fas fa-edit me-1"></i>
                  {{ formatDate(service.updatedAt) }}
                </small>
              </div>
            </div>

            <!-- Service Actions -->
            <div class="service-actions">
              <button 
                class="btn btn-sm btn-outline-primary"
                (click)="editService(service)"
                title="Chỉnh sửa">
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="btn btn-sm btn-outline-secondary"
                (click)="toggleServiceStatus(service)"
                [title]="service.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'">
                <i class="fas fa-{{ service.isActive ? 'eye-slash' : 'eye' }}"></i>
              </button>
              <button 
                class="btn btn-sm btn-outline-info"
                (click)="viewServiceDetails(service)"
                title="Xem chi tiết">
                <i class="fas fa-info-circle"></i>
              </button>
              <button 
                class="btn btn-sm btn-outline-danger"
                (click)="deleteService(service)"
                title="Xóa">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && filteredServices.length === 0 && !showForm">
        <div class="empty-icon">
          <i class="fas fa-cogs"></i>
        </div>
        <h4>{{ searchTerm || filterType || filterCategory || filterStatus ? 'Không tìm thấy dịch vụ nào' : 'Chưa có dịch vụ nào' }}</h4>
        <p class="text-muted">
          {{ searchTerm || filterType || filterCategory || filterStatus 
            ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm' 
            : 'Hãy tạo dịch vụ đầu tiên để bắt đầu' }}
        </p>
        <button 
          class="btn btn-primary"
          (click)="showAddForm()"
          *ngIf="!searchTerm && !filterType && !filterCategory && !filterStatus">
          <i class="fas fa-plus me-2"></i>
          Tạo dịch vụ đầu tiên
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

      <!-- Service Details Modal -->
      <div class="modal fade" [class.show]="showModal" [style.display]="showModal ? 'block' : 'none'" 
           *ngIf="showModal" (click)="closeModal($event)">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-info-circle me-2"></i>
                Chi tiết dịch vụ: {{ selectedService?.name }}
              </h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body" *ngIf="selectedService">
              <div class="row">
                <div class="col-md-8">
                  <table class="table table-borderless">
                    <tr>
                      <th width="30%">Tên dịch vụ:</th>
                      <td>{{ selectedService.name }}</td>
                    </tr>
                    <tr>
                      <th>Loại:</th>
                      <td>
                        <span class="badge" [style.background-color]="getServiceTypeColor(selectedService.type)">
                          {{ formatServiceType(selectedService.type) }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Danh mục:</th>
                      <td>{{ selectedService.category }}</td>
                    </tr>
                    <tr>
                      <th>Quyền truy cập:</th>
                      <td><code>{{ selectedService.permission }}</code></td>
                    </tr>
                    <tr *ngIf="selectedService.description">
                      <th>Mô tả:</th>
                      <td>{{ selectedService.description }}</td>
                    </tr>
                    <tr>
                      <th>Trạng thái:</th>
                      <td>
                        <span class="status-badge" [class]="selectedService.isActive ? 'status-active' : 'status-inactive'">
                          {{ selectedService.isActive ? 'Hoạt động' : 'Không hoạt động' }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Ngày tạo:</th>
                      <td>{{ formatDate(selectedService.createdAt) }}</td>
                    </tr>
                    <tr>
                      <th>Cập nhật cuối:</th>
                      <td>{{ formatDate(selectedService.updatedAt) }}</td>
                    </tr>
                  </table>

                  <!-- Metadata -->
                  <div *ngIf="selectedService.metadata && hasMetadata(selectedService.metadata)">
                    <h6>Metadata:</h6>
                    <div class="metadata-display">
                      <div class="metadata-item" *ngFor="let item of getMetadataArray(selectedService.metadata)">
                        <strong>{{ item.key }}:</strong> {{ item.value }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <!-- Image -->
                  <div class="text-center mb-3" *ngIf="selectedService.image">
                    <h6>Hình ảnh:</h6>
                    <img [src]="getFileUrl(selectedService.image)" 
                         class="img-fluid rounded" 
                         style="max-height: 200px;">
                  </div>
                  
                  <!-- Video -->
                  <div class="text-center" *ngIf="selectedService.tutorialVideo">
                    <h6>Video hướng dẫn:</h6>
                    <video [src]="getFileUrl(selectedService.tutorialVideo)" 
                           controls 
                           class="img-fluid rounded" 
                           style="max-height: 200px; width: 100%;">
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .service-management-container {
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

    /* Service Cards */
    .service-card {
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

    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    }

    .service-image {
      height: 200px;
      overflow: hidden;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .service-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image {
      color: white;
      font-size: 3rem;
      opacity: 0.7;
    }

    .service-type-badge {
      position: absolute;
      top: 15px;
      right: 15px;
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .service-content {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .service-header {
      margin-bottom: 1rem;
    }

    .service-name {
      font-size: 1.3rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
    }

    .service-category {
      color: #6c757d;
      font-size: 0.9rem;
    }

    .service-description {
      color: #6c757d;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .service-permission {
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #495057;
    }

    .service-permission code {
      background-color: #f8f9fa;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }

    .service-media {
      margin-bottom: 1rem;
    }

    .media-indicators {
      display: flex;
      gap: 0.5rem;
    }

    .media-indicator {
      background-color: #e9ecef;
      color: #6c757d;
      padding: 0.2rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }

    .service-metadata {
      margin-bottom: 1rem;
    }

    .metadata-count {
      color: #6c757d;
      font-size: 0.9rem;
    }

    .service-status {
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

    .service-meta {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .service-actions {
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

    /* Modal */
    .modal {
      background-color: rgba(0,0,0,0.5);
    }

    .metadata-display {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
    }

    .metadata-item {
      margin-bottom: 0.5rem;
      padding: 0.25rem 0;
    }

    /* Service type specific colors */
    .service-card.type-basic .service-image {
      background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    }

    .service-card.type-premium .service-image {
      background: linear-gradient(135deg, #fd7e14 0%, #e55812 100%);
    }

    .service-card.type-enterprise .service-image {
      background: linear-gradient(135deg, #6f42c1 0%, #5a2d91 100%);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .service-management-container {
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
export class FeatureListComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  loading = false;
  formLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Form state
  showForm = false;
  editMode = false;
  selectedService: Service | null = null;

  // Modal state
  showModal = false;

  // Filter state
  searchTerm = '';
  filterType = '';
  filterCategory = '';
  filterStatus = '';

  serviceTypes = SERVICE_TYPES;
  uniqueCategories: string[] = [];

  constructor(
    private serviceService: ServiceService,
    private authService: AuthService
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated() && this.authService.isAdmin();
  }

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    this.error = null;

    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.updateUniqueCategories();
        this.filterServices();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  updateUniqueCategories() {
    this.uniqueCategories = [...new Set(this.services.map(s => s.category))].sort();
  }

  filterServices() {
    let filtered = [...this.services];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(term) ||
        (service.description && service.description.toLowerCase().includes(term)) ||
        service.category.toLowerCase().includes(term) ||
        service.permission.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (this.filterType) {
      filtered = filtered.filter(service => service.type === this.filterType);
    }

    // Category filter
    if (this.filterCategory) {
      filtered = filtered.filter(service => service.category === this.filterCategory);
    }

    // Status filter
    if (this.filterStatus) {
      const isActive = this.filterStatus === 'active';
      filtered = filtered.filter(service => service.isActive === isActive);
    }

    this.filteredServices = filtered;
  }

  showAddForm() {
    this.showForm = true;
    this.editMode = false;
    this.selectedService = null;
  }

  editService(service: Service) {
    this.showForm = true;
    this.editMode = true;
    this.selectedService = service;
  }

  hideForm() {
    this.showForm = false;
    this.editMode = false;
    this.selectedService = null;
    this.clearMessages();
  }

  viewServiceDetails(service: Service) {
    this.selectedService = service;
    this.showModal = true;
  }

  closeModal(event?: Event) {
    if (event && event.target !== event.currentTarget) return;
    this.showModal = false;
    this.selectedService = null;
  }

  onFormSubmit(serviceData: CreateServiceRequest) {
    this.formLoading = true;
    this.error = null;

    const operation = this.editMode && this.selectedService
      ? this.serviceService.updateService(this.selectedService._id, serviceData as UpdateServiceRequest)
      : this.serviceService.createService(serviceData);

    operation.subscribe({
      next: (result) => {
        this.formLoading = false;
        this.successMessage = this.editMode ? 'Cập nhật dịch vụ thành công!' : 'Tạo dịch vụ mới thành công!';
        this.hideForm();
        this.loadServices();
        this.clearMessagesAfterDelay();
      },
      error: (error) => {
        this.formLoading = false;
        this.error = error.message;
      }
    });
  }

  toggleServiceStatus(service: Service) {
    if (confirm(`Bạn có chắc muốn ${service.isActive ? 'vô hiệu hóa' : 'kích hoạt'} dịch vụ "${service.name}"?`)) {
      this.serviceService.toggleServiceStatus(service._id).subscribe({
        next: (updatedService) => {
          const index = this.services.findIndex(s => s._id === service._id);
          if (index >= 0) {
            this.services[index] = updatedService;
            this.filterServices();
          }
          this.successMessage = `${service.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} dịch vụ thành công!`;
          this.clearMessagesAfterDelay();
        },
        error: (error) => {
          this.error = error.message;
        }
      });
    }
  }

  deleteService(service: Service) {
    if (confirm(`Bạn có chắc muốn xóa dịch vụ "${service.name}"? Hành động này không thể hoàn tác.`)) {
      this.serviceService.deleteService(service._id).subscribe({
        next: () => {
          this.services = this.services.filter(s => s._id !== service._id);
          this.updateUniqueCategories();
          this.filterServices();
          this.successMessage = 'Xóa dịch vụ thành công!';
          this.clearMessagesAfterDelay();
        },
        error: (error) => {
          this.error = error.message;
        }
      });
    }
  }

  refreshServices() {
    this.searchTerm = '';
    this.filterType = '';
    this.filterCategory = '';
    this.filterStatus = '';
    this.loadServices();
  }

  // Utility methods
  formatServiceType(type: string): string {
    return this.serviceService.formatServiceType(type);
  }

  getServiceTypeColor(type: string): string {
    return this.serviceService.getServiceTypeColor(type);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('vi-VN');
  }

  getFileUrl(filePath?: string): string {
    return this.serviceService.getFileUrl(filePath);
  }

  getActiveServicesCount(): number {
    return this.services.filter(service => service.isActive).length;
  }

  getUniqueCategories(): number {
    return this.uniqueCategories.length;
  }

  getPremiumServicesCount(): number {
    return this.services.filter(service => service.type === 'premium' || service.type === 'enterprise').length;
  }

  hasMetadata(metadata?: { [key: string]: string }): boolean {
    return !!(metadata && Object.keys(metadata).length > 0);
  }

  getMetadataCount(metadata?: { [key: string]: string }): number {
    return metadata ? Object.keys(metadata).length : 0;
  }

  getMetadataArray(metadata?: { [key: string]: string }): { key: string; value: string }[] {
    if (!metadata) return [];
    return Object.keys(metadata).map(key => ({ key, value: metadata[key] }));
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