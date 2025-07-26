import { Request, Response } from 'express';
import { AuthService } from '../services/auth-service';
import { insertUserSchema } from '../../shared/schema';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * تسجيل مستخدم جديد
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = insertUserSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'بيانات غير صحيحة',
          errors: validationResult.error.errors
        });
        return;
      }

      const userData = validationResult.data;
      const result = await this.authService.createUser(userData);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'تم التسجيل بنجاح'
      });
    } catch (error: any) {
      console.error('Error in register:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'خطأ في التسجيل'
      });
    }
  }

  /**
   * تسجيل الدخول
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'البريد الإلكتروني وكلمة المرور مطلوبان'
        });
        return;
      }

      const result = await this.authService.login(email, password);
      
      res.json({
        success: true,
        data: result,
        message: 'تم تسجيل الدخول بنجاح'
      });
    } catch (error: any) {
      console.error('Error in login:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'خطأ في تسجيل الدخول'
      });
    }
  }

  /**
   * تسجيل الخروج
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      await this.authService.logout(req);
      
      res.json({
        success: true,
        message: 'تم تسجيل الخروج بنجاح'
      });
    } catch (error) {
      console.error('Error in logout:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في تسجيل الخروج'
      });
    }
  }

  /**
   * التحقق من حالة المصادقة
   */
  async checkAuth(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.authService.getCurrentUser(req);
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'غير مصادق'
        });
        return;
      }

      res.json({
        success: true,
        data: user,
        message: 'مصادق'
      });
    } catch (error) {
      console.error('Error in checkAuth:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في التحقق من المصادقة'
      });
    }
  }
} 