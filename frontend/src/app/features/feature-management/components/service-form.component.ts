import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service, CreateServiceRequest, SERVICE_TYPES, SERVICE_CATEGORIES } from '../models/service.model';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <form [formGroup]="serviceForm" (ngSubmit)="onSubmit()" class="service-form">
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
                  <label for="name" class="form-label">Tên dịch vụ <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control"
                    id="name"
                    formControlName="name"
                    [class.is-invalid]="isFieldInvalid('name')"
                    placeholder="Nhập tên dịch vụ">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('name')">
                    Vui lòng nhập tên dịch vụ
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="type" class="form-label">Loại dịch vụ <span class="text-danger">*</span></label>
                  <select 
                    class="form-select"
                    id="type"
                    formControlName="type"
                    [class.is-invalid]="isFieldInvalid('type')">
                    <option value="">Chọn loại dịch vụ</option>
                    <option *ngFor="let type of serviceTypes" [value]="type.value">
                      {{ type.label }}
                    </option>
                  </select>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('type')">
                    Vui lòng chọn loại dịch vụ
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="category" class="form-label">Danh mục <span class="text-danger">*</span></label>
                  <select 
                    class="form-select"
                    id="category"
                    formControlName="category"
                    [class.is-invalid]="isFieldInvalid('category')">
                    <option value="">Chọn danh mục</option>
                    <option *ngFor="let category of serviceCategories" [value]="category">
                      {{ category }}
                    </option>
                  </select>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('category')">
                    Vui lòng chọn danh mục
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="permission" class="form-label">Quyền truy cập <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control"
                    id="permission"
                    formControlName="permission"
                    [class.is-invalid]="isFieldInvalid('permission')"
                    placeholder="Nhập quyền truy cập (vd: user.read)">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('permission')">
                    Vui lòng nhập quyền truy cập
                  </div>
                </div>

                <div class="col-12 mb-3">
                  <label for="description" class="form-label">Mô tả</label>
                  <textarea 
                    class="form-control"
                    id="description"
                    formControlName="description"
                    rows="4"
                    placeholder="Nhập mô tả dịch vụ..."></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Metadata Section -->
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="fas fa-tags me-2"></i>
                Metadata (Tùy chọn)
              </h5>
              <button 
                type="button" 
                class="btn btn-sm btn-outline-primary"
                (click)="addMetadata()">
                <i class="fas fa-plus me-1"></i>
                Thêm metadata
              </button>
            </div>
            <div class="card-body">
              <div class="metadata-list">
                <div 
                  *ngFor="let meta of metadataEntries; let i = index" 
                  class="metadata-item p-3 border rounded mb-3">
                  <div class="row align-items-center">
                    <div class="col-md-5">
                      <label class="form-label">Key</label>
                      <input 
                        type="text" 
                        class="form-control"
                        [(ngModel)]="meta.key"
                        [ngModelOptions]="{standalone: true}"
                        placeholder="Nhập key">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Value</label>
                      <input 
                        type="text" 
                        class="form-control"
                        [(ngModel)]="meta.value"
                        [ngModelOptions]="{standalone: true}"
                        placeholder="Nhập value">
                    </div>
                    <div class="col-md-1">
                      <button 
                        type="button" 
                        class="btn btn-sm btn-outline-danger"
                        (click)="removeMetadata(i)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div *ngIf="metadataEntries.length === 0" class="text-center text-muted py-4">
                  <i class="fas fa-tags fa-2x mb-2 d-block"></i>
                  Chưa có metadata nào. Click "Thêm metadata" để bắt đầu.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Files & Settings -->
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-file me-2"></i>
                Tệp tin
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label for="image" class="form-label">Hình ảnh dịch vụ</label>
                <input 
                  type="file" 
                  class="form-control"
                  id="image"
                  (change)="onImageSelect($event)"
                  accept="image/*">
                <small class="text-muted">Tối đa 5MB. Định dạng: JPG, PNG, GIF</small>
              </div>

              <div class="mb-3">
                <label for="tutorialVideo" class="form-label">Video hướng dẫn</label>
                <input 
                  type="file" 
                  class="form-control"
                  id="tutorialVideo"
                  (change)="onVideoSelect($event)"
                  accept="video/*">
                <small class="text-muted">Tối đa 100MB. Định dạng: MP4, AVI, MOV</small>
              </div>

              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="isActive"
                  formControlName="isActive">
                <label class="form-check-label" for="isActive">
                  Kích hoạt dịch vụ
                </label>
              </div>
            </div>
          </div>

          <!-- Image Preview -->
          <div class="card mb-4" *ngIf="imagePreview || (editMode && serviceData?.image)">
            <div class="card-header">
              <h6 class="mb-0">Xem trước hình ảnh</h6>
            </div>
            <div class="card-body text-center">
              <img 
                [src]="imagePreview || getFileUrl(serviceData?.image)" 
                alt="Service Preview"
                class="img-fluid rounded"
                style="max-height: 200px;">
            </div>
          </div>

          <!-- Video Preview -->
          <div class="card mb-4" *ngIf="videoPreview || (editMode && serviceData?.tutorialVideo)">
            <div class="card-header">
              <h6 class="mb-0">Video hướng dẫn</h6>
            </div>
            <div class="card-body text-center">
              <video 
                *ngIf="videoPreview || serviceData?.tutorialVideo"
                [src]="videoPreview || getFileUrl(serviceData?.tutorialVideo)"
                controls
                class="img-fluid rounded"
                style="max-height: 200px; width: 100%;">
                Trình duyệt không hỗ trợ video.
              </video>
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
              [disabled]="serviceForm.invalid || loading">
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
    .service-form {
      max-width: 100%;
    }
    
    .metadata-item {
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
    
    .metadata-list {
      min-height: 100px;
    }

    video {
      max-width: 100%;
      height: auto;
    }
  `]
})
export class ServiceFormComponent implements OnInit, OnChanges {
  @Input() serviceData: Service | null = null;
  @Input() editMode: boolean = false;
  @Input() loading: boolean = false;
  @Output() formSubmit = new EventEmitter<CreateServiceRequest>();
  @Output() formCancel = new EventEmitter<void>();

  serviceForm!: FormGroup;
  selectedImage: File | null = null;
  selectedVideo: File | null = null;
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  metadataEntries: { key: string; value: string }[] = [];

  serviceTypes = SERVICE_TYPES;
  serviceCategories = SERVICE_CATEGORIES;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['serviceData'] && this.serviceData && this.editMode) {
      this.populateForm();
    }
  }

  initForm() {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      type: ['', Validators.required],
      category: ['', Validators.required],
      permission: ['', Validators.required],
      isActive: [true]
    });
  }

  populateForm() {
    if (!this.serviceData) return;

    this.serviceForm.patchValue({
      name: this.serviceData.name,
      description: this.serviceData.description,
      type: this.serviceData.type,
      category: this.serviceData.category,
      permission: this.serviceData.permission,
      isActive: this.serviceData.isActive
    });

    // Populate metadata
    this.metadataEntries = [];
    if (this.serviceData.metadata) {
      Object.keys(this.serviceData.metadata).forEach(key => {
        this.metadataEntries.push({
          key: key,
          value: this.serviceData!.metadata![key]
        });
      });
    }

    // Set image and video previews
    if (this.serviceData.image) {
      this.imagePreview = this.getFileUrl(this.serviceData.image);
    }
    if (this.serviceData.tutorialVideo) {
      this.videoPreview = this.getFileUrl(this.serviceData.tutorialVideo);
    }
  }

  addMetadata() {
    this.metadataEntries.push({ key: '', value: '' });
  }

  removeMetadata(index: number) {
    this.metadataEntries.splice(index, 1);
  }

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File ảnh quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh.');
        return;
      }

      this.selectedImage = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onVideoSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('File video quá lớn. Vui lòng chọn file nhỏ hơn 100MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Vui lòng chọn file video.');
        return;
      }

      this.selectedVideo = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.videoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.serviceForm.valid) {
      const formValue = this.serviceForm.value;
      
      // Convert metadata entries to object
      const metadata: { [key: string]: string } = {};
      this.metadataEntries.forEach(entry => {
        if (entry.key && entry.value) {
          metadata[entry.key] = entry.value;
        }
      });
      
      const serviceRequest: CreateServiceRequest = {
        name: formValue.name,
        description: formValue.description,
        type: formValue.type,
        category: formValue.category,
        permission: formValue.permission,
        isActive: formValue.isActive,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        image: this.selectedImage || undefined,
        tutorialVideo: this.selectedVideo || undefined
      };

      this.formSubmit.emit(serviceRequest);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.serviceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFileUrl(filePath?: string): string {
    if (!filePath) return '';
    return `http://localhost:5000/${filePath}`;
  }
} 