# JINZMedia Admin Dashboard

Angular 17+ admin dashboard cho JINZMedia với giao diện hiện đại và tính năng quản lý toàn diện.

## 🎯 Tính năng chính

- **🏠 Dashboard Tổng quan**: Thống kê và biểu đồ tổng quan hệ thống
- **👥 Quản lí người dùng**: Quản lý user, vai trò và quyền hạn
- **📦 Quản lí các gói**: Quản lý gói dịch vụ, định giá và đăng ký
- **⚙️ Quản lí tính năng**: Quản lý tính năng, API config và testing
- **📊 Báo cáo thống kê**: Dashboard analytics, reports và export data
- **🔐 Authentication**: Đăng nhập/đăng ký tích hợp với backend API
- **📱 Responsive Design**: Hỗ trợ desktop, tablet và mobile
- **🎨 Modern UI/UX**: Giao diện đẹp với Bootstrap 5 và Material Design

## 🏗️ Công nghệ sử dụng

- **Framework**: Angular 17+ (Standalone Components)
- **UI Library**: Bootstrap 5 + Angular Material
- **Icons**: Font Awesome 6
- **Charts**: Chart.js + ng2-charts
- **Styling**: SCSS với CSS Variables
- **Notifications**: ngx-toastr + SweetAlert2
- **HTTP Client**: Angular HttpClient với Interceptors
- **Routing**: Angular Router với Lazy Loading
- **Build Tool**: Angular CLI

## 📁 Cấu trúc dự án

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Core services & utilities
│   │   │   ├── services/           # API services, Auth service
│   │   │   ├── guards/             # Route guards
│   │   │   └── interceptors/       # HTTP interceptors
│   │   ├── shared/                 # Shared components & utilities
│   │   │   ├── components/         # Reusable components
│   │   │   ├── directives/         # Custom directives
│   │   │   └── pipes/              # Custom pipes
│   │   ├── features/               # Feature modules
│   │   │   ├── user-management/    # Quản lý người dùng
│   │   │   ├── package-management/ # Quản lý gói
│   │   │   ├── feature-management/ # Quản lý tính năng
│   │   │   └── reports/            # Báo cáo thống kê
│   │   ├── layout/                 # Layout components
│   │   │   ├── header/             # Header component
│   │   │   ├── sidebar/            # Sidebar navigation
│   │   │   ├── footer/             # Footer component
│   │   │   └── admin-layout/       # Main admin layout
│   │   ├── app.component.ts        # Root component
│   │   ├── app.config.ts           # App configuration
│   │   └── app.routes.ts           # Main routing
│   ├── assets/                     # Static assets
│   │   ├── images/                 # Images & logos
│   │   └── icons/                  # Custom icons
│   ├── environments/               # Environment configs
│   └── styles.scss                 # Global styles
├── angular.json                    # Angular workspace config
├── package.json                    # Dependencies
└── README.md                       # Tài liệu này
```

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống

- Node.js 18+ 
- npm 9+ hoặc yarn
- Angular CLI 17+

### Cài đặt dependencies

```bash
# Clone project
cd frontend

# Cài đặt Angular CLI (nếu chưa có)
npm install -g @angular/cli

# Cài đặt dependencies
npm install
```

### Chạy ứng dụng

```bash
# Development mode
npm start
# hoặc
ng serve

# Production build
npm run build:prod
# hoặc
ng build --configuration production
```

Ứng dụng sẽ chạy tại: `http://localhost:4200`

## 🎨 Menu Navigation

### 📋 Dashboard
- Tổng quan hệ thống
- Thống kê nhanh
- Biểu đồ và metrics

### 👥 Quản lí người dùng
- **Danh sách người dùng**: Xem, tìm kiếm, filter users
- **Thêm người dùng**: Tạo tài khoản mới
- **Vai trò & Quyền**: Quản lý permissions và roles

### 📦 Quản lí các gói
- **Danh sách gói**: Quản lý các gói dịch vụ
- **Tạo gói mới**: Thêm gói dịch vụ mới
- **Định giá gói**: Cấu hình giá và tính năng
- **Đăng ký gói**: Theo dõi subscriptions

### ⚙️ Quản lí tính năng
- **Danh sách tính năng**: Quản lý features
- **Thêm tính năng**: Tạo feature mới
- **Cấu hình API**: API endpoints config
- **Kiểm tra tính năng**: Testing và validation

### 📊 Báo cáo thống kê
- **Tổng quan**: Dashboard analytics
- **Thống kê người dùng**: User analytics
- **Thống kê gói**: Package analytics
- **Doanh thu**: Revenue reports
- **Xuất báo cáo**: Export data

### 🔧 Cài đặt
- **Cài đặt chung**: System settings
- **Email & SMS**: Notification config
- **Bảo mật**: Security settings
- **Sao lưu dữ liệu**: Backup management

## 🎯 Tính năng UI/UX

### 🎨 Design System
- **Color Scheme**: Modern blue theme với dark accents
- **Typography**: Roboto font family
- **Icons**: Font Awesome 6 icons
- **Components**: Bootstrap 5 + Angular Material

### 📱 Responsive Design
- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Overlay sidebar với hamburger menu

### ✨ Animations
- **Smooth transitions**: CSS transitions cho mọi interactions
- **Loading states**: Skeleton loaders và spinners
- **Page transitions**: Fade in/out animations
- **Micro interactions**: Hover effects và feedback

### 🎭 Interactive Elements
- **Sidebar**: Collapsible với sub-menus
- **Tables**: Sortable, filterable, pagination
- **Forms**: Real-time validation
- **Modals**: SweetAlert2 integration
- **Notifications**: Toast notifications

## 🔧 Configuration

### Environment Variables

**development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  appName: 'JINZMedia Admin Dashboard',
  // ... other configs
};
```

**production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.jinzmedia.com/api',
  appName: 'JINZMedia Admin Dashboard',
  // ... other configs
};
```

### API Integration

Kết nối với JINZMedia Backend API:
- Base URL: `http://localhost:5000/api` (development)
- Authentication: JWT tokens
- HTTP Interceptors cho error handling
- Auto token refresh

## 🎨 Styling Guide

### CSS Variables
```scss
:root {
  --primary-color: #007bff;
  --sidebar-width: 260px;
  --header-height: 70px;
  --border-radius: 8px;
  --transition: all 0.3s ease;
}
```

### Component Structure
- SCSS modules cho mỗi component
- BEM naming convention
- Responsive mixins
- Utility classes

### Theme Customization
- Dễ dàng thay đổi color scheme
- Light/Dark mode support
- Custom CSS properties
- Consistent spacing system

## 🔒 Authentication Flow

1. **Login**: User đăng nhập qua form
2. **JWT Token**: Lưu token vào localStorage
3. **Route Guards**: Bảo vệ protected routes
4. **Auto Refresh**: Tự động refresh token
5. **Logout**: Clear token và redirect

## 📱 Responsive Breakpoints

```scss
// Mobile
@media (max-width: 576px) { }

// Tablet
@media (max-width: 768px) { }

// Desktop small
@media (max-width: 1024px) { }

// Desktop large
@media (min-width: 1200px) { }
```

## 🚀 Build & Deploy

### Development Build
```bash
ng build --configuration development
```

### Production Build
```bash
ng build --configuration production
```

### Deploy to Server
```bash
# Build production
npm run build:prod

# Upload dist/ folder to server
# Configure web server (nginx/apache)
```

### Environment Setup
1. Update `environment.prod.ts` với production API URL
2. Configure CORS trên backend
3. Setup SSL certificates
4. Configure CDN (optional)

## 🧪 Testing

```bash
# Unit tests
ng test

# E2E tests
ng e2e

# Code coverage
ng test --code-coverage
```

## 📈 Performance

### Lazy Loading
- Feature modules được lazy load
- Reduced initial bundle size
- Faster loading times

### Optimization
- OnPush change detection strategy
- TrackBy functions cho *ngFor
- Image optimization
- Tree shaking

## 🎯 Best Practices

### Code Organization
- Feature-based folder structure
- Standalone components
- Injectable services
- Type-safe interfaces

### Performance
- Lazy loading modules
- OnPush change detection
- Proper unsubscribe patterns
- Optimized images

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

## 🐛 Troubleshooting

### Common Issues

**1. Module not found errors**
```bash
npm install
ng build
```

**2. API connection issues**
- Check backend server đang chạy
- Verify API URL trong environment
- Check CORS settings

**3. Styling issues**
```bash
# Clear cache
npm start -- --delete-output-path
```

## 📞 Hỗ trợ

- **Documentation**: Đọc README này
- **Issues**: Tạo issue trên repository
- **Email**: contact@jinzmedia.com

## 📄 License

MIT License - JINZMedia Team

---

**Tạo bởi JINZMedia Team với ❤️** 