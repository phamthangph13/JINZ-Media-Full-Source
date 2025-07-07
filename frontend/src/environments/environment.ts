export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  appName: 'JINZMedia Admin Dashboard',
  version: '1.0.0',
  enableDebugLog: true,
  features: {
    enableAnalytics: false,
    enablePushNotifications: false,
    enableOfflineMode: false
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100]
  },
  ui: {
    theme: 'light',
    sidebarCollapsed: false,
    showAnimations: true
  }
}; 