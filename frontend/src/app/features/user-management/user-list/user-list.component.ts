import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-user-list',
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">
          <i class="fas fa-users me-3"></i>
          Danh sách người dùng
        </h1>
        <button class="btn btn-primary">
          <i class="fas fa-plus me-2"></i>
          Thêm người dùng
        </button>
      </div>
      
      <div class="card">
        <div class="card-body">
          <p class="text-center text-muted py-5">
            <i class="fas fa-users fa-3x mb-3 d-block"></i>
            Trang quản lý người dùng đang được phát triển...
          </p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container {
      padding: 2rem 0;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .page-title {
      margin: 0;
      color: #333;
    }
  `]
})
export class UserListComponent {} 