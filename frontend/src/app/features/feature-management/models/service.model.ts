export interface Service {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  tutorialVideo?: string;
  type: 'basic' | 'premium' | 'enterprise';
  category: string;
  permission: string;
  isActive: boolean;
  metadata?: { [key: string]: string };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  image?: File;
  tutorialVideo?: File;
  type: 'basic' | 'premium' | 'enterprise';
  category: string;
  permission: string;
  isActive?: boolean;
  metadata?: { [key: string]: string };
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  _id: string;
}

export interface ServicesResponse {
  success: boolean;
  count: number;
  data: Service[];
}

export interface ServiceResponse {
  success: boolean;
  data: Service;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// Common service types and categories for UI
export const SERVICE_TYPES = [
  { value: 'basic', label: 'Cơ bản', color: '#6c757d' },
  { value: 'premium', label: 'Cao cấp', color: '#fd7e14' },
  { value: 'enterprise', label: 'Doanh nghiệp', color: '#6f42c1' }
] as const;

export const SERVICE_CATEGORIES = [
  'AI Tools',
  'Image Processing', 
  'Video Editing',
  'Audio Processing',
  'Text Processing',
  'Data Analysis',
  'Web Scraping',
  'API Integration',
  'File Conversion',
  'Social Media',
  'E-commerce',
  'Productivity',
  'Security',
  'Other'
] as const; 