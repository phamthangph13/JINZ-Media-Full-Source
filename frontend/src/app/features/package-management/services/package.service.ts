import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { 
  Package, 
  CreatePackageRequest, 
  UpdatePackageRequest, 
  PackagesResponse, 
  PackageResponse, 
  ApiResponse 
} from '../models/package.model';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = `${environment.apiUrl}/admin/packages`;

  constructor(private http: HttpClient) {}

  // Get all packages
  getPackages(): Observable<Package[]> {
    return this.http.get<PackagesResponse>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Get single package by ID
  getPackage(id: string): Observable<Package> {
    return this.http.get<PackageResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Create new package
  createPackage(packageData: CreatePackageRequest): Observable<Package> {
    const formData = this.createFormData(packageData);
    
    return this.http.post<PackageResponse>(this.apiUrl, formData).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Update package
  updatePackage(id: string, packageData: UpdatePackageRequest): Observable<Package> {
    const formData = this.createFormData(packageData);
    
    return this.http.put<PackageResponse>(`${this.apiUrl}/${id}`, formData).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Delete package
  deletePackage(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Toggle package status
  togglePackageStatus(id: string): Observable<Package> {
    return this.http.patch<PackageResponse>(`${this.apiUrl}/${id}/toggle-status`, {}).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Helper method to create FormData for file uploads
  private createFormData(data: CreatePackageRequest | UpdatePackageRequest): FormData {
    const formData = new FormData();

    // Add basic fields
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.type) formData.append('type', data.type);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.originalPrice !== undefined) formData.append('originalPrice', data.originalPrice.toString());
    if (data.currency) formData.append('currency', data.currency);
    if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
    if (data.isPopular !== undefined) formData.append('isPopular', data.isPopular.toString());
    if (data.displayOrder !== undefined) formData.append('displayOrder', data.displayOrder.toString());

    // Add duration if present
    if (data.duration) {
      formData.append('duration[value]', data.duration.value.toString());
      formData.append('duration[unit]', data.duration.unit);
    }

    // Add features array
    if (data.features && data.features.length > 0) {
      data.features.forEach((feature, index) => {
        formData.append(`features[${index}][serviceId]`, feature.serviceId);
        formData.append(`features[${index}][isUnlimited]`, feature.isUnlimited.toString());
        formData.append(`features[${index}][limit]`, feature.limit.toString());
      });
    }

    // Add included services array
    if (data.includedServices && data.includedServices.length > 0) {
      data.includedServices.forEach((service, index) => {
        formData.append(`includedServices[${index}][serviceId]`, service.serviceId);
        formData.append(`includedServices[${index}][isUnlimited]`, service.isUnlimited.toString());
        if (service.usageLimit !== null) {
          formData.append(`includedServices[${index}][usageLimit]`, service.usageLimit.toString());
        }
      });
    }

    // Add metadata if present
    if (data.metadata) {
      if (data.metadata.color) formData.append('metadata[color]', data.metadata.color);
      if (data.metadata.icon) formData.append('metadata[icon]', data.metadata.icon);
      if (data.metadata.badge) formData.append('metadata[badge]', data.metadata.badge);
    }

    // Add image file if present
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
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

    console.error('Package Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Format price for display
  formatPrice(price: number, currency: string = 'VND'): string {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price);
    }
  }

  // Format package type for display
  formatPackageType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'monthly': 'Hàng tháng',
      'yearly': 'Hàng năm',
      'lifetime': 'Trọn đời'
    };
    return typeMap[type] || type;
  }
} 