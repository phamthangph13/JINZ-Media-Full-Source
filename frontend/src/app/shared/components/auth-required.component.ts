import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-required',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-required-container">
      <div class="auth-required-card">
        <div class="auth-icon">
          <i class="fas fa-lock fa-3x"></i>
        </div>
        <h3>Yêu cầu đăng nhập</h3>
        <p class="text-muted mb-4">
          Bạn cần đăng nhập với tài khoản admin để truy cập trang này.
        </p>
        <div class="auth-actions">
          <button 
            class="btn btn-primary"
            (click)="goToLogin()">
            <i class="fas fa-sign-in-alt me-2"></i>
            Đăng nhập ngay
          </button>
        </div>
        <div class="auth-info mt-4">
          <small class="text-muted">
            <i class="fas fa-info-circle me-1"></i>
            Nếu bạn chưa có tài khoản admin, vui lòng liên hệ quản trị viên hệ thống.
          </small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-required-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 2rem;
    }

    .auth-required-card {
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      padding: 3rem;
      text-align: center;
      max-width: 500px;
      width: 100%;
    }

    .auth-icon {
      color: #6c757d;
      margin-bottom: 2rem;
    }

    h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .btn {
      padding: 0.75rem 2rem;
      font-weight: 500;
      border-radius: 25px;
      transition: all 0.3s ease;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .auth-info {
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    @media (max-width: 768px) {
      .auth-required-card {
        padding: 2rem 1.5rem;
      }
    }
  `]
})
export class AuthRequiredComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/auth']);
  }
} 