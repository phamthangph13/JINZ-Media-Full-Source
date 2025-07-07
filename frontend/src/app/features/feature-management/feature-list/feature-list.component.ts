import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-feature-list',
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <h1 class="page-title">
        <i class="fas fa-list-check me-3"></i>
        Danh sách tính năng
      </h1>
      <div class="card">
        <div class="card-body">
          <p class="text-center text-muted py-5">
            <i class="fas fa-list-check fa-3x mb-3 d-block"></i>
            Quản lý tính năng đang được phát triển...
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
export class FeatureListComponent {} 