import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  avatar?: string;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: User;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing token on service initialization
    this.checkAuthStatus();
  }

  // Login user
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        if (response.success && response.token) {
          // Store token and user data
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.data));
          this.currentUserSubject.next(response.data);
        }
        return response;
      })
    );
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // Force logout (clear all auth data)
  forceLogout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!token && !!user;
  }

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get user profile
  getProfile(): Observable<User> {
    return this.http.get<{success: boolean, data: User}>(`${this.apiUrl}/me`).pipe(
      map(response => response.data)
    );
  }

  // Check authentication status on app load
  private checkAuthStatus(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        // Invalid user data, clear storage
        this.logout();
      }
    }
  }

  // Auto-logout when token expires
  private autoLogout(): void {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        
        if (expirationTime <= now) {
          this.logout();
        } else {
          // Set timeout to logout when token expires
          setTimeout(() => {
            this.logout();
          }, expirationTime - now);
        }
      } catch (error) {
        this.logout();
      }
    }
  }
} 