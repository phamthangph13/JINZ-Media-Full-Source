import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-admin-layout',
    imports: [
        CommonModule,
        RouterOutlet,
        SidebarComponent,
        HeaderComponent,
        FooterComponent
    ],
    template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <app-sidebar 
        [isCollapsed]="sidebarCollapsed"
        (toggleSidebar)="toggleSidebar()">
      </app-sidebar>
      
      <!-- Main Content -->
      <div class="main-content" [class.sidebar-collapsed]="sidebarCollapsed">
        <!-- Header -->
        <app-header 
          (toggleSidebar)="toggleSidebar()"
          (profileMenuClick)="handleProfileMenu($event)">
        </app-header>
        
        <!-- Page Content -->
        <main class="page-content">
          <div class="container-fluid">
            <router-outlet></router-outlet>
          </div>
        </main>
        
        <!-- Footer -->
        <app-footer></app-footer>
      </div>
      
      <!-- Overlay for mobile -->
      <div 
        class="sidebar-overlay" 
        [class.show]="showMobileOverlay"
        (click)="closeMobileSidebar()">
      </div>
    </div>
  `,
    styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  sidebarCollapsed = false;
  showMobileOverlay = false;
  isMobile = false;

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    
    if (this.isMobile) {
      this.showMobileOverlay = !this.sidebarCollapsed;
    }
  }

  closeMobileSidebar() {
    if (this.isMobile) {
      this.sidebarCollapsed = true;
      this.showMobileOverlay = false;
    }
  }

  handleProfileMenu(action: string) {
    switch (action) {
      case 'profile':
        // Navigate to profile
        console.log('Navigate to profile');
        break;
      case 'settings':
        // Navigate to settings
        console.log('Navigate to settings');
        break;
      case 'logout':
        // Handle logout
        console.log('Logout');
        break;
    }
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    
    if (this.isMobile) {
      this.sidebarCollapsed = true;
      this.showMobileOverlay = false;
    } else {
      this.showMobileOverlay = false;
    }
  }
} 