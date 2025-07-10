import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { 
  User, 
  UserResponse, 
  CreateUserRequest, 
  UpdateUserRequest, 
  AssignPackageRequest,
  UserStats 
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/admin/users`;
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all users with filters and pagination
  getUsers(filters: {
    page?: number;
    limit?: number;
    sort?: string;
    role?: string;
    isActive?: boolean;
    search?: string;
  } = {}): Observable<UserResponse> {
    let params = new HttpParams();
    
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.sort) params = params.set('sort', filters.sort);
    if (filters.role) params = params.set('role', filters.role);
    if (filters.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());
    if (filters.search) params = params.set('search', filters.search);

    return this.http.get<UserResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        this.usersSubject.next(response.data);
        return response;
      })
    );
  }

  // Get user statistics
  getUserStats(): Observable<UserStats> {
    return this.http.get<{success: boolean, data: UserStats}>(`${this.apiUrl}/stats`).pipe(
      map(response => response.data)
    );
  }

  // Get single user
  getUser(id: string): Observable<User> {
    return this.http.get<{success: boolean, data: User}>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  // Create new user
  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<{success: boolean, data: User}>(this.apiUrl, userData).pipe(
      map(response => {
        this.refreshUsers();
        return response.data;
      })
    );
  }

  // Update user
  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<{success: boolean, data: User}>(`${this.apiUrl}/${id}`, userData).pipe(
      map(response => {
        this.refreshUsers();
        return response.data;
      })
    );
  }

  // Delete user
  deleteUser(id: string): Observable<void> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        this.refreshUsers();
      })
    );
  }

  // Assign package to user
  assignPackage(userId: string, packageData: AssignPackageRequest): Observable<User> {
    return this.http.post<{success: boolean, data: User}>(`${this.apiUrl}/${userId}/assign-package`, packageData).pipe(
      map(response => {
        this.refreshUsers();
        return response.data;
      })
    );
  }

  // Remove package from user
  removePackage(userId: string): Observable<User> {
    return this.http.delete<{success: boolean, data: User}>(`${this.apiUrl}/${userId}/remove-package`).pipe(
      map(response => {
        this.refreshUsers();
        return response.data;
      })
    );
  }

  // Toggle user active status
  toggleUserStatus(id: string): Observable<User> {
    return this.getUser(id).pipe(
      switchMap((user: User) => {
        return this.updateUser(id, { isActive: !user.isActive });
      })
    );
  }

  // Refresh users list
  private refreshUsers(): void {
    this.getUsers().subscribe();
  }

  // Search users
  searchUsers(query: string): Observable<UserResponse> {
    return this.getUsers({ search: query });
  }

  // Get users by role
  getUsersByRole(role: 'user' | 'admin'): Observable<UserResponse> {
    return this.getUsers({ role });
  }

  // Get active/inactive users
  getUsersByStatus(isActive: boolean): Observable<UserResponse> {
    return this.getUsers({ isActive });
  }
} 