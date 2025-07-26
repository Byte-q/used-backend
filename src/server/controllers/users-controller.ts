import { Request, Response } from 'express';
import { UsersService } from '../services/users-service';
import { insertUserSchema } from '../../shared/schema';

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  /**
   * الحصول على قائمة المستخدمين
   */
  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.usersService.getAllUsers();
      res.json({
        success: true,
        data: users,
        message: 'تم جلب قائمة المستخدمين بنجاح'
      });
    } catch (error) {
      console.error('Error in listUsers:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب قائمة المستخدمين'
      });
    }
  }

  /**
   * الحصول على مستخدم بواسطة المعرف
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = id;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'معرف المستخدم غير صحيح'
        });
        return;
      }

      const user = await this.usersService.getUserById(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'المستخدم غير موجود'
        });
        return;
      }

      res.json({
        success: true,
        data: user,
        message: 'تم جلب بيانات المستخدم بنجاح'
      });
    } catch (error) {
      console.error('Error in getUserById:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب بيانات المستخدم'
      });
    }
  }

  async getByUsername(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
    const username = name;

    if (!username) {
        res.status(400).json({
          success: false,
          message: 'اسم المستخدم غير صحيح'
        });
        return;
      }

      const user = await this.usersService.getUserByUsername(username);
    if (!user) {
        res.status(404).json({
          success: false,
          message: 'المستخدم غير موجود'
        });
        return;
      }

      res.json({
        success: true,
        data: user,
        message: 'تم جلب بيانات المستخدم بنجاح'
      });
    } catch (error) {
      console.error('Error in getUserById:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب بيانات المستخدم'
      });
    }

      

  }

  /**
   * إنشاء مستخدم جديد
   */
  async createUser(req: Request, res: Response): Promise<void> {
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

      const userData = {
        ...validationResult.data,
        createdAt: new Date()
      };
      const newUser = await this.usersService.createUser(userData);
      
      res.status(201).json({
        success: true,
        data: newUser,
        message: 'تم إنشاء المستخدم بنجاح'
      });
    } catch (error) {
      console.error('Error in createUser:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في إنشاء المستخدم'
      });
    }
  }

  /**
   * تحديث بيانات مستخدم
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = id;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'معرف المستخدم غير صحيح'
        });
        return;
      }

      const validationResult = insertUserSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'بيانات غير صحيحة',
          errors: validationResult.error.errors
        });
        return;
      }

      const userData = validationResult.data;
      const updatedUser = await this.usersService.updateUser(userId, userData);
      
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: 'المستخدم غير موجود'
        });
        return;
      }

      res.json({
        success: true,
        data: updatedUser,
        message: 'تم تحديث بيانات المستخدم بنجاح'
      });
    } catch (error) {
      console.error('Error in updateUser:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في تحديث بيانات المستخدم'
      });
    }
  }

  /**
   * حذف مستخدم
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = id;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'معرف المستخدم غير صحيح'
        });
        return;
      }

      const deleted = await this.usersService.deleteUser(userId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'المستخدم غير موجود'
        });
        return;
      }

      res.json({
        success: true,
        message: 'تم حذف المستخدم بنجاح'
      });
    } catch (error) {
      console.error('Error in deleteUser:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في حذف المستخدم'
      });
    }
  }
} 