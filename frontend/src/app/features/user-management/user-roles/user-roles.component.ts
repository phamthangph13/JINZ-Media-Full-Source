import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-user-roles',
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <h1 class="page-title">
        <i class="fas fa-user-shield me-3"></i>
        Vai trò & Quyền
      </h1>
      <div class="card">
        <div class="card-body">
          <p class="text-center text-muted py-5">
            <i class="fas fa-user-shield fa-3x mb-3 d-block"></i>
            Quản lý vai trò và quyền đang được phát triển...
          </p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container { padding: 2rem 0; }
    .page-title { margin-bottom: 2rem; color: #333; }
  `]
})
export class UserRolesComponent {} 