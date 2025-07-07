import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-auth',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <img src="assets/images/logo.png" alt="JINZMedia" class="auth-logo">
          <h2>Đăng nhập Admin</h2>
          <p>Chào mừng bạn quay trở lại JINZMedia Admin Dashboard</p>
        </div>
        
        <form class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              class="form-control" 
              placeholder="admin@jinzmedia.com"
              required>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Mật khẩu</label>
            <input 
              type="password" 
              id="password" 
              class="form-control" 
              placeholder="••••••••"
              required>
          </div>
          
          <div class="form-check">
            <input type="checkbox" id="remember" class="form-check-input">
            <label for="remember" class="form-check-label">Ghi nhớ đăng nhập</label>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary w-100"
            (click)="onLogin()">
            Đăng nhập
          </button>
        </form>
        
        <div class="auth-footer">
          <a href="#" class="forgot-link">Quên mật khẩu?</a>
        </div>
      </div>
    </div>
  `,
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  onLogin() {
    // Temporary login logic - redirect to dashboard
    window.location.href = '/admin/dashboard';
  }
} 