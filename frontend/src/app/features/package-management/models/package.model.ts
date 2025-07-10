export interface PackageFeature {
  serviceId: string;
  isUnlimited: boolean;
  limit: number;
}

export interface IncludedService {
  serviceId: string;
  isUnlimited: boolean;
  usageLimit: number | null;
}

export interface PackageMetadata {
  color?: string;
  icon?: string;
  badge?: string;
}

export interface PackageDuration {
  value: number;
  unit: 'days' | 'months' | 'years';
}

export interface Package {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  type: 'monthly' | 'yearly' | 'lifetime';
  price: number;
  originalPrice?: number;
  currency: 'VND' | 'USD';
  duration?: PackageDuration;
  features: PackageFeature[];
  includedServices: IncludedService[];
  isActive: boolean;
  isPopular: boolean;
  displayOrder: number;
  metadata?: PackageMetadata;
  subscribersCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePackageRequest {
  name: string;
  description?: string;
  image?: File;
  type: 'monthly' | 'yearly' | 'lifetime';
  price: number;
  originalPrice?: number;
  currency?: 'VND' | 'USD';
  duration?: PackageDuration;
  features: PackageFeature[];
  includedServices?: IncludedService[];
  isActive?: boolean;
  isPopular?: boolean;
  displayOrder?: number;
  metadata?: PackageMetadata;
}

export interface UpdatePackageRequest extends Partial<CreatePackageRequest> {
  _id: string;
}

export interface PackagesResponse {
  success: boolean;
  count: number;
  data: Package[];
}

export interface PackageResponse {
  success: boolean;
  data: Package;
}

export interface ApiResponse {
  success: boolean;
  message: string;
} 