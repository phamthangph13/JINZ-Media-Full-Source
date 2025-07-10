import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Package, CreatePackageRequest, PackageFeature } from '../models/package.model';
import { ServiceService } from '../../feature-management/services/service.service';
import { Service } from '../../feature-management/models/service.model';

@Component({
  selector: 'app-package-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="packageForm" (ngSubmit)="onSubmit()" class="package-form">
      <div class="row">
        <!-- Basic Information -->
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-info-circle me-2"></i>
                Thông tin cơ bản
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="name" class="form-label">Tên gói <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control"
                    id="name"
                    formControlName="name"
                    [class.is-invalid]="isFieldInvalid('name')"
                    placeholder="Nhập tên gói">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('name')">
                    Vui lòng nhập tên gói
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="type" class="form-label">Loại gói <span class="text-danger">*</span></label>
                  <select 
                    class="form-select"
                    id="type"
                    formControlName="type"
                    [class.is-invalid]="isFieldInvalid('type')">
                    <option value="">Chọn loại gói</option>
                    <option value="monthly">Hàng tháng</option>
                    <option value="yearly">Hàng năm</option>
                    <option value="lifetime">Trọn đời</option>
                  </select>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('type')">
                    Vui lòng chọn loại gói
                  </div>
                </div>

                <div class="col-12 mb-3">
                  <label for="description" class="form-label">Mô tả</label>
                  <textarea 
                    class="form-control"
                    id="description"
                    formControlName="description"
                    rows="3"
                    placeholder="Nhập mô tả gói..."></textarea>
                </div>

                <div class="col-md-4 mb-3">
                  <label for="price" class="form-label">Giá <span class="text-danger">*</span></label>
                  <input 
                    type="number" 
                    class="form-control"
                    id="price"
                    formControlName="price"
                    [class.is-invalid]="isFieldInvalid('price')"
                    min="0"
                    step="0.01"
                    placeholder="0">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('price')">
                    Vui lòng nhập giá hợp lệ
                  </div>
                </div>

                <div class="col-md-4 mb-3">
                  <label for="originalPrice" class="form-label">Giá gốc</label>
                  <input 
                    type="number" 
                    class="form-control"
                    id="originalPrice"
                    formControlName="originalPrice"
                    min="0"
                    step="0.01"
                    placeholder="0">
                </div>

                <div class="col-md-4 mb-3">
                  <label for="currency" class="form-label">Đơn vị tiền tệ</label>
                  <select 
                    class="form-select"
                    id="currency"
                    formControlName="currency">
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <!-- Duration for non-lifetime packages -->
                <div class="col-md-6 mb-3" *ngIf="packageForm.get('type')?.value !== 'lifetime'">
                  <label for="durationValue" class="form-label">Thời gian <span class="text-danger">*</span></label>
                  <input 
                    type="number" 
                    class="form-control"
                    id="durationValue"
                    formControlName="durationValue"
                    min="1"
                    placeholder="1">
                </div>

                <div class="col-md-6 mb-3" *ngIf="packageForm.get('type')?.value !== 'lifetime'">
                  <label for="durationUnit" class="form-label">Đơn vị thời gian <span class="text-danger">*</span></label>
                  <select 
                    class="form-select"
                    id="durationUnit"
                    formControlName="durationUnit">
                    <option value="days">Ngày</option>
                    <option value="months">Tháng</option>
                    <option value="years">Năm</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Features Section -->
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="fas fa-star me-2"></i>
                Tính năng gói
              </h5>
              <button 
                type="button" 
                class="btn btn-sm btn-outline-primary"
                (click)="addFeature()">
                <i class="fas fa-plus me-1"></i>
                Thêm tính năng
              </button>
            </div>
            <div class="card-body">
              <div class="features-list" formArrayName="features">
                <div 
                  *ngFor="let feature of features.controls; let i = index" 
                  [formGroupName]="i"
                  class="feature-item p-3 border rounded mb-3">
                  <div class="row align-items-center">
                    <div class="col-md-6">
                      <label class="form-label">Dịch vụ</label>
                      <select 
                        class="form-select"
                        formControlName="serviceId">
                        <option value="">Chọn dịch vụ</option>
                        <option *ngFor="let service of availableServices" [value]="service._id">
                          {{ service.name }} ({{ formatServiceType(service.type) }})
                        </option>
                      </select>
                    </div>
                    <div class="col-md-3">
                      <div class="form-check">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          formControlName="isUnlimited"
                          [id]="'unlimited-' + i">
                        <label class="form-check-label" [for]="'unlimited-' + i">
                          Không giới hạn
                        </label>
                      </div>
                    </div>
                    <div class="col-md-2" *ngIf="!feature.get('isUnlimited')?.value">
                      <label class="form-label">Giới hạn</label>
                      <input 
                        type="number" 
                        class="form-control"
                        formControlName="limit"
                        min="0">
                    </div>
                    <div class="col-md-1">
                      <button 
                        type="button" 
                        class="btn btn-sm btn-outline-danger"
                        (click)="removeFeature(i)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div *ngIf="features.length === 0" class="text-center text-muted py-4">
                  <i class="fas fa-star fa-2x mb-2 d-block"></i>
                  Chưa có tính năng nào. Click "Thêm tính năng" để bắt đầu.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings & Preview -->
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-cog me-2"></i>
                Cài đặt
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label for="image" class="form-label">Hình ảnh gói</label>
                <input 
                  type="file" 
                  class="form-control"
                  id="image"
                  (change)="onFileSelect($event)"
                  accept="image/*">
                <small class="text-muted">Tối đa 5MB. Định dạng: JPG, PNG, GIF</small>
              </div>

              <div class="mb-3">
                <label for="displayOrder" class="form-label">Thứ tự hiển thị</label>
                <input 
                  type="number" 
                  class="form-control"
                  id="displayOrder"
                  formControlName="displayOrder"
                  min="0">
              </div>

              <div class="form-check mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="isActive"
                  formControlName="isActive">
                <label class="form-check-label" for="isActive">
                  Kích hoạt gói
                </label>
              </div>

              <div class="form-check mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="isPopular"
                  formControlName="isPopular">
                <label class="form-check-label" for="isPopular">
                  Gói phổ biến
                </label>
              </div>
            </div>
          </div>

          <!-- Image Preview -->
          <div class="card mb-4" *ngIf="imagePreview || (editMode && packageData?.image)">
            <div class="card-header">
              <h6 class="mb-0">Xem trước hình ảnh</h6>
            </div>
            <div class="card-body text-center">
              <img 
                [src]="imagePreview || getImageUrl(packageData?.image)" 
                alt="Package Preview"
                class="img-fluid rounded"
                style="max-height: 200px;">
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-end gap-2">
            <button 
              type="button" 
              class="btn btn-secondary"
              (click)="onCancel()">
              <i class="fas fa-times me-1"></i>
              Hủy
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="packageForm.invalid || loading">
              <i class="fas fa-spinner fa-spin me-1" *ngIf="loading"></i>
              <i class="fas fa-save me-1" *ngIf="!loading"></i>
              {{ editMode ? 'Cập nhật' : 'Tạo mới' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  `,
  styles: [`
    .package-form {
      max-width: 100%;
    }
    
    .feature-item {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6 !important;
    }
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }
    
    .form-label {
      font-weight: 500;
      color: #495057;
    }
    
    .text-danger {
      color: #dc3545 !important;
    }
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
    
    .features-list {
      min-height: 100px;
    }
  `]
})
export class PackageFormComponent implements OnInit, OnChanges {
  @Input() packageData: Package | null = null;
  @Input() editMode: boolean = false;
  @Input() loading: boolean = false;
  @Output() formSubmit = new EventEmitter<CreatePackageRequest>();
  @Output() formCancel = new EventEmitter<void>();

  packageForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  availableServices: Service[] = [];

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
    this.loadServices();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['packageData'] && this.packageData && this.editMode) {
      this.populateForm();
    }
  }

  initForm() {
    this.packageForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      type: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      originalPrice: [0, Validators.min(0)],
      currency: ['VND'],
      durationValue: [1, Validators.min(1)],
      durationUnit: ['months'],
      features: this.fb.array([]),
      isActive: [true],
      isPopular: [false],
      displayOrder: [0, Validators.min(0)]
    });
  }

  get features() {
    return this.packageForm.get('features') as FormArray;
  }

  addFeature() {
    const featureGroup = this.fb.group({
      serviceId: ['', Validators.required],
      isUnlimited: [true],
      limit: [0, Validators.min(0)]
    });
    this.features.push(featureGroup);
  }

  removeFeature(index: number) {
    this.features.removeAt(index);
  }

  populateForm() {
    if (!this.packageData) return;

    this.packageForm.patchValue({
      name: this.packageData.name,
      description: this.packageData.description,
      type: this.packageData.type,
      price: this.packageData.price,
      originalPrice: this.packageData.originalPrice,
      currency: this.packageData.currency,
      durationValue: this.packageData.duration?.value,
      durationUnit: this.packageData.duration?.unit,
      isActive: this.packageData.isActive,
      isPopular: this.packageData.isPopular,
      displayOrder: this.packageData.displayOrder
    });

    // Clear and populate features
    this.features.clear();
    this.packageData.features.forEach(feature => {
      const featureGroup = this.fb.group({
        serviceId: [feature.serviceId, Validators.required],
        isUnlimited: [feature.isUnlimited],
        limit: [feature.limit, Validators.min(0)]
      });
      this.features.push(featureGroup);
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh.');
        return;
      }

      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.packageForm.valid) {
      const formValue = this.packageForm.value;
      
      const packageRequest: CreatePackageRequest = {
        name: formValue.name,
        description: formValue.description,
        type: formValue.type,
        price: formValue.price,
        originalPrice: formValue.originalPrice || undefined,
        currency: formValue.currency,
        features: formValue.features,
        isActive: formValue.isActive,
        isPopular: formValue.isPopular,
        displayOrder: formValue.displayOrder,
        image: this.selectedFile || undefined
      };

      // Add duration for non-lifetime packages
      if (formValue.type !== 'lifetime') {
        packageRequest.duration = {
          value: formValue.durationValue,
          unit: formValue.durationUnit
        };
      }

      this.formSubmit.emit(packageRequest);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.packageForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getImageUrl(imagePath?: string): string {
    if (!imagePath) return '';
    return `http://localhost:5000/${imagePath}`;
  }

  loadServices() {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.availableServices = services.filter(s => s.isActive);
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }

  formatServiceType(type: string): string {
    return this.serviceService.formatServiceType(type);
  }
} 