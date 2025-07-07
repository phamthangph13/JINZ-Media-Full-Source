export const environment = {
  production: true,
  apiUrl: 'https://api.jinzmedia.com/api',
  appName: 'JINZMedia Admin Dashboard',
  version: '1.0.0',
  enableDebugLog: false,
  features: {
    enableAnalytics: true,
    enablePushNotifications: true,
    enableOfflineMode: true
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