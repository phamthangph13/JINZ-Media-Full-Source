import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { 
  Service, 
  CreateServiceRequest, 
  UpdateServiceRequest, 
  ServicesResponse, 
  ServiceResponse, 
  ApiResponse,
  SERVICE_TYPES 
} from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/admin/services`;

  constructor(private http: HttpClient) {}

  // Get all services
  getServices(): Observable<Service[]> {
    return this.http.get<ServicesResponse>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Get single service by ID
  getService(id: string): Observable<Service> {
    return this.http.get<ServiceResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Create new service
  createService(serviceData: CreateServiceRequest): Observable<Service> {
    const formData = this.createFormData(serviceData);
    
    return this.http.post<ServiceResponse>(this.apiUrl, formData).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Update service
  updateService(id: string, serviceData: UpdateServiceRequest): Observable<Service> {
    const formData = this.createFormData(serviceData);
    
    return this.http.put<ServiceResponse>(`${this.apiUrl}/${id}`, formData).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Delete service
  deleteService(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Toggle service status
  toggleServiceStatus(id: string): Observable<Service> {
    return this.http.patch<ServiceResponse>(`${this.apiUrl}/${id}/toggle-status`, {}).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Helper method to create FormData for file uploads
  private createFormData(data: CreateServiceRequest | UpdateServiceRequest): FormData {
    const formData = new FormData();

    // Add basic fields
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.type) formData.append('type', data.type);
    if (data.category) formData.append('category', data.category);
    if (data.permission) formData.append('permission', data.permission);
    if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());

    // Add metadata if present
    if (data.metadata) {
      Object.keys(data.metadata).forEach(key => {
        if (data.metadata![key]) {
          formData.append(`metadata[${key}]`, data.metadata![key]);
        }
      });
    }

    // Add image file if present
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
    }

    // Add tutorial video file if present
    if (data.tutorialVideo && data.tutorialVideo instanceof File) {
      formData.append('tutorialVideo', data.tutorialVideo);
    }

    return formData;
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Đã xảy ra lỗi không xác định';
    
    if (error.error) {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('Service Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Format service type for display
  formatServiceType(type: string): string {
    const serviceType = SERVICE_TYPES.find(t => t.value === type);
    return serviceType ? serviceType.label : type;
  }

  // Get service type color
  getServiceTypeColor(type: string): string {
    const serviceType = SERVICE_TYPES.find(t => t.value === type);
    return serviceType ? serviceType.color : '#6c757d';
  }

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Check if file is valid image
  isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024; // 5MB limit
  }

  // Check if file is valid video
  isValidVideoFile(file: File): boolean {
    const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
    return validTypes.includes(file.type) && file.size <= 100 * 1024 * 1024; // 100MB limit
  }

  // Get file URL for display
  getFileUrl(filePath?: string): string {
    if (!filePath) return '';
    // Remove leading slash if present and use environment apiUrl
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    return `${environment.apiUrl.replace('/api', '')}/${cleanPath}`;
  }
} 