import { UsersService } from './users-service';
import { Request } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

// In-memory store for refresh tokens (for production, use DB)
const refreshTokens = new Map<string, string>();

const JWT_SECRET = process.env.JWT_SECRET || 'fullsco-jwt-secret';
const JWT_EXPIRATION = parseEnvDuration(process.env.JWT_EXPIRATION, 900); // 15m default
const REFRESH_TOKEN_EXPIRATION = parseEnvDuration(process.env.REFRESH_TOKEN_EXPIRATION, 604800); // 7d default

function parseEnvDuration(val: string | undefined, fallback: number): number {
  if (!val) return fallback;
  if (/^\d+$/.test(val)) return parseInt(val, 10);
  if (/^\d+m$/.test(val)) return parseInt(val, 10) * 60;
  if (/^\d+h$/.test(val)) return parseInt(val, 10) * 60 * 60;
  if (/^\d+d$/.test(val)) return parseInt(val, 10) * 60 * 60 * 24;
  return fallback;
}

function generateJwtToken(user: any) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

function generateRefreshToken(user: any) {
  const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
  refreshTokens.set(refreshToken, user._id.toString());
  return refreshToken;
}

export function verifyRefreshToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (refreshTokens.has(token) && refreshTokens.get(token) === payload.id) {
      return payload;
    }
    return null;
  } catch {
    return null;
  }
}

export { refreshTokens };

export class AuthService {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  /**
   * تسجيل الدخول
   */
  async login(username: string, password: string): Promise<any | null> {
    const user = await this.usersService.login(username, password);
    if (user) {
        // 2. Generate tokens
        const JWT_SECRET = process.env.JWT_SECRET || 'fullsco-jwt-secret';
        const JWT_EXPIRATION = process.env.JWT_EXPIRATION ? parseInt(process.env.JWT_EXPIRATION, 10) : 900;
        const userId = (user as any)._id || (user as any).id
        const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        // For refresh token, you can use a different secret or a random string
        const refreshToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
      return { accessToken, refreshToken, user };
    }
    return null;
  }

  /**
   * تسجيل الخروج
   */
  async logout(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
      // التحقق من وجود جلسة نشطة
      if (!req.session) {
        resolve();
        return;
      }
      // إلغاء الجلسة
      req.session.destroy((err: any) => {
        if (err) {
          console.error('Error destroying session during logout:', err);
          reject(new Error('فشل في إلغاء الجلسة'));
        } else {
          console.log('Session destroyed successfully during logout');
          resolve();
        }
      });
    });
  }

  /**
   * الحصول على المستخدم الحالي من الطلب
   */
  async getCurrentUser(req: Request): Promise<any | null> {
    // التحقق من وجود المستخدم في الجلسة
    if (!req.user) {
      return null;
    }
    const userId = (req.user as any)._id || (req.user as any).id;
    if (!userId) {
      return null;
    }
    const user = await this.usersService.getUserById(userId.toString());
    return user || null;
  }

  /**
   * التسجيل (إنشاء حساب جديد)
   */
  async createUser(userData: any): Promise<any> {
    return this.usersService.createUser(userData);
  }

  /**
   * الحصول على مستخدم بواسطة المعرف
   */
  async getUserById(id: string): Promise<any | undefined> {
    return this.usersService.getUserById(id);
  }

  /**
   * التحقق مما إذا كان المستخدم مسؤولاً
   */
  isAdmin(user: any): boolean {
    return this.usersService.isAdmin(user);
  }

  /**
   * البحث عن مستخدم بواسطة اسم المستخدم
   */
  async getUserByUsername(username: string): Promise<any | undefined> {
    return this.usersService.getUserByUsername(username);
  }

  /**
   * البحث عن مستخدم بواسطة البريد الإلكتروني
   */
  async getUserByEmail(email: string): Promise<any | undefined> {
    return this.usersService.getUserByEmail(email);
  }
}
