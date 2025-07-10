import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, LoginRequest } from '../../core/services/auth.service';

@Component({
    selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="auth-container">
      <div class="auth-background">
        <div class="auth-overlay"></div>
      </div>
      
      <div class="auth-content">
      <div class="auth-card">
        <div class="auth-header">
            <div class="logo">
              <h1>JINZMedia</h1>
              <p>Admin Dashboard</p>
            </div>
        </div>
        
          <div class="auth-body">
            <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
          <div class="form-group">
                <label for="email">Email</label>
                <div class="input-group">
                  <i class="fas fa-envelope"></i>
            <input 
              type="email" 
              id="email" 
              class="form-control" 
                    formControlName="email"
                    placeholder="Nhập email của bạn"
                    [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                </div>
                <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="invalid-feedback">
                  <div *ngIf="loginForm.get('email')?.errors?.['required']">Email là bắt buộc</div>
                  <div *ngIf="loginForm.get('email')?.errors?.['email']">Email không hợp lệ</div>
                </div>
          </div>
          
          <div class="form-group">
                <label for="password">Mật khẩu</label>
                <div class="input-group">
                  <i class="fas fa-lock"></i>
            <input 
                    [type]="showPassword ? 'text' : 'password'" 
              id="password" 
              class="form-control" 
                    formControlName="password"
                    placeholder="Nhập mật khẩu"
                    [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                  <button 
                    type="button" 
                    class="password-toggle"
                    (click)="togglePasswordVisibility()">
                    <i class="fas" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"></i>
                  </button>
                </div>
                <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="invalid-feedback">
                  <div *ngIf="loginForm.get('password')?.errors?.['required']">Mật khẩu là bắt buộc</div>
                  <div *ngIf="loginForm.get('password')?.errors?.['minlength']">Mật khẩu phải có ít nhất 6 ký tự</div>
                </div>
          </div>
          
              <div class="form-group">
          <div class="form-check">
                  <input 
                    type="checkbox" 
                    id="remember"
                    class="form-check-input"
                    formControlName="remember">
                  <label class="form-check-label" for="remember">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
          </div>
          
          <button 
            type="submit" 
                class="btn btn-primary btn-login"
                [disabled]="loginForm.invalid">
                <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                <i *ngIf="!isLoading" class="fas fa-sign-in-alt me-2"></i>
                {{ isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>
        </form>
        
        <div class="auth-footer">
              <p class="text-center">
                <a href="#" class="forgot-password">Quên mật khẩu?</a>
              </p>
              <p class="text-center">
                <button type="button" class="btn btn-link btn-sm" (click)="clearStorage()">
                  Clear Storage (Dev)
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .auth-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    }

    .auth-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
    }

    .auth-content {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }

    .auth-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .auth-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }

    .logo h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
    }

    .logo p {
      margin: 0.5rem 0 0;
      opacity: 0.9;
      font-size: 0.9rem;
    }

    .auth-body {
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .input-group {
      position: relative;
    }

    .input-group i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
      z-index: 1;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .password-toggle {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      padding: 0.25rem;
      z-index: 1;
    }

    .password-toggle:hover {
      color: #333;
    }

    .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #dc3545;
    }

    .form-check {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-check-input {
      width: 1.25rem;
      height: 1.25rem;
      margin: 0;
    }

    .form-check-label {
      font-size: 0.9rem;
      color: #666;
      cursor: pointer;
    }

    .btn-login {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .auth-footer {
      margin-top: 2rem;
      text-align: center;
    }

    .forgot-password {
      color: #667eea;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .forgot-password:hover {
      text-decoration: underline;
    }

    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
      border-width: 0.15em;
    }

    @media (max-width: 480px) {
      .auth-content {
        padding: 1rem;
      }
      
      .auth-header {
        padding: 1.5rem;
      }
      
      .auth-body {
        padding: 1.5rem;
      }
    }
  `]
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  ngOnInit(): void {
    // If already authenticated and admin, redirect to dashboard
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.disableForm();
      
      const credentials: LoginRequest = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          
          if (response.success && response.data) {
            console.log('User data:', response.data);
            console.log('Is authenticated:', this.authService.isAuthenticated());
            console.log('Is admin:', this.authService.isAdmin());
            
            if (this.authService.isAdmin()) {
              this.toastr.success('Đăng nhập thành công');
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.toastr.error('Bạn không có quyền truy cập trang quản trị');
              this.authService.logout();
            }
          } else {
            this.toastr.error('Đăng nhập thất bại');
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.toastr.error(error.error?.message || 'Đăng nhập thất bại');
          this.enableForm();
        },
        complete: () => {
          this.isLoading = false;
          this.enableForm();
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private disableForm(): void {
    this.loginForm.disable();
  }

  private enableForm(): void {
    this.loginForm.enable();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearStorage(): void {
    this.authService.forceLogout();
    window.location.reload();
  }
} 