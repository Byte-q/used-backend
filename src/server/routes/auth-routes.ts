import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { z } from 'zod';
import { AuthService, verifyRefreshToken, refreshTokens } from '../services/auth-service';
import { insertUserSchema } from '../../shared/schema';
import { handleException, successResponse } from '../utils/api-helper';
import jwt from 'jsonwebtoken';

const router= Router();
const authService = new AuthService();

// تسجيل الدخول
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.login(username, password);
  if (result) {
    // Optionally set tokens as httpOnly cookies
    // res.cookie('accessToken', result.accessToken, { httpOnly: true });
    // res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
    res.json({ accessToken: result.accessToken, refreshToken: result.refreshToken, user: result.user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Add refresh token endpoint
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  const payload = verifyRefreshToken(refreshToken);
  if (payload) {
    const JWT_SECRET = process.env.JWT_SECRET || 'fullsco-jwt-secret';
    const JWT_EXPIRATION = process.env.JWT_EXPIRATION
      ? /^\d+$/.test(process.env.JWT_EXPIRATION)
        ? parseInt(process.env.JWT_EXPIRATION, 10)
        : 900 // fallback to 15m
      : 900;

    const accessToken = jwt.sign(
      { id: payload.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );
    res.json({ accessToken });
  } else {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// تسجيل الخروج
router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken && refreshTokens.has(refreshToken)) {
    refreshTokens.delete(refreshToken);
  }
      if (req.session) {
    req.session.destroy(() => {
      res.json({ message: 'Logged out' });
    });
  } else {
    res.json({ message: 'Log out Failed' });
  }
});

// الحصول على معلومات المستخدم الحالي
router.get('/me', (req: Request, res: Response) => {
  // if (!req.isAuthenticated()) {
  //   return res.status(401).json({
  //     success: false,
  //     message: 'غير مصادق عليه'
  //   });
  // }

  // التحقق من وجود المستخدم في الجلسة
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'المستخدم غير موجود في الجلسة'
    });
  }

  // إذا كان المستخدم موجودًا، قم بإرجاع معلوماته
  const user = req.user as any;

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'المستخدم غير موجود'
    });
  }
  // حذف كلمة المرور من معلومات المستخدم
  const { password, ...userWithoutPassword } = user;
  
  return res.json(successResponse(userWithoutPassword));
});

// إنشاء حساب جديد (التسجيل)
router.post('/register', async (req: Request, res: Response) => {
  try {
    // التحقق من صحة البيانات باستخدام Zod
    const validatedData = insertUserSchema.parse(req.body);
    
    // إنشاء المستخدم في قاعدة البيانات
    const newUser = await authService.createUser(validatedData);
    
    // تسجيل الدخول تلقائياً بعد التسجيل الناجح
    req.login(newUser, (err) => {
      if (err) {
        return handleException(res, err);
      }
      
      // إعداد معلومات الجلسة
      if (req.session) {
        req.session.userId = newUser._id;
        // req.session.isAdmin = newUser.role === 'admin';
      }
      
      // حذف كلمة المرور من الاستجابة
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json(successResponse(
        userWithoutPassword,
        'تم إنشاء الحساب بنجاح'
      ));
    });
  } catch (error) {
    // التعامل مع أخطاء التحقق من صحة البيانات
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'خطأ في بيانات المستخدم',
        errors: error.errors
      });
      return;
    }
    
    // التعامل مع أخطاء اسم المستخدم أو البريد الإلكتروني المكرر
    if (error instanceof Error && (
      error.message === 'اسم المستخدم مستخدم بالفعل' || 
      error.message === 'البريد الإلكتروني مستخدم بالفعل'
    )) {
      res.status(409).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    handleException(res, error);
  }
});

export default router;
