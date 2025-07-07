import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-reports-export',
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <h1 class="page-title">
        <i class="fas fa-file-export me-3"></i>
        Xuất báo cáo
      </h1>
      <div class="card">
        <div class="card-body">
          <p class="text-center text-muted py-5">
            <i class="fas fa-file-export fa-3x mb-3 d-block"></i>
            Xuất báo cáo đang được phát triển...
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
export class ReportsExportComponent {} 