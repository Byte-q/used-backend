/**
 * تكوين التطبيق
 * يحتوي على الإعدادات العامة للتطبيق
 */
export const AppConfig = {
  server: {
    port: process.env.PORT || 3500,
    apiPrefix: '/api',
    sessionSecret: process.env.SESSION_SECRET || 'fullsco-secret-key',
    uploadsDir: './uploads',
    jwtSecret: process.env.JWT_SECRET || 'fullsco-jwt-secret',
    jwtExpiration: '24h',
    maxSize: 1024 * 1024 * 5, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  },
  database: {
    url: process.env.DATABASE_URL
  },
  mail: {},
  development: {
    enableFakeAuth: process.env.NODE_ENV === 'development',
    logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
  }
};
