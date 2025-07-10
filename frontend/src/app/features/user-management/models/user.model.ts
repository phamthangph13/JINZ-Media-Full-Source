export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  avatar?: string;
  phone?: string;
  lastLogin?: Date;
  subscription?: {
    packageId?: string;
    startDate?: Date;
    endDate?: Date;
    isActive: boolean;
    isLifetime: boolean;
  };
  usageHistory?: Array<{
    serviceId: string;
    usedAt: Date;
    details: any;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  subscribedUsers: number;
  newUsersThisMonth: number;
  growthRate: number;
}

export interface UserResponse {
  success: boolean;
  count: number;
  total: number;
  pagination?: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
  data: User[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  phone?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  phone?: string;
}

export interface AssignPackageRequest {
  packageId: string;
  startDate?: Date;
  customEndDate?: Date;
} 