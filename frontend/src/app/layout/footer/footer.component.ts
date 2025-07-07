import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    imports: [CommonModule],
    template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-left">
          <span class="copyright">
            © 2024 <strong>JINZMedia</strong>. All rights reserved.
          </span>
        </div>
        
        <div class="footer-right">
          <div class="footer-links">
            <a href="#" class="footer-link">Privacy Policy</a>
            <a href="#" class="footer-link">Terms of Service</a>
            <a href="#" class="footer-link">Support</a>
          </div>
          
          <div class="footer-version">
            <span class="version-text">Version {{ version }}</span>
          </div>
        </div>
      </div>
    </footer>
  `,
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  version = '1.0.0';
} 