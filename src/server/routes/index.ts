import { Express } from 'express';
import authRoutes from './auth-routes';
import usersRoutes from './users-routes';
import postsRoutes from './posts-routes';
import productsRoutes from './products-route';

/**
 * تسجيل جميع مسارات API
 */
export function registerApiRoutes(app: Express, apiPrefix: string): void {
  // تسجيل مسارات المصادقة
  app.use(`${apiPrefix}/auth`, authRoutes);

  // تسجيل مسارات المستخدمين
  app.use(`${apiPrefix}/users`, usersRoutes);

  // تسجيل مسارات المقالات
  app.use(`${apiPrefix}/posts`, postsRoutes);
  
  // تسجيل مسارات المنتجات
  app.use(`${apiPrefix}/products`, productsRoutes);
}
