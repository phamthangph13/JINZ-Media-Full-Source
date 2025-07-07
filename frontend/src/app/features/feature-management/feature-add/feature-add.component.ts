import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-feature-add',
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <h1 class="page-title">
        <i class="fas fa-plus me-3"></i>
        Thêm tính năng
      </h1>
      <div class="card">
        <div class="card-body">
          <p class="text-center text-muted py-5">
            <i class="fas fa-plus fa-3x mb-3 d-block"></i>
            Form thêm tính năng đang được phát triển...
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
export class FeatureAddComponent {} 