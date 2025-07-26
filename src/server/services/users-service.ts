import { UsersRepository } from '../repositories/users-repository';
import { IUser } from '../models/User';
import bcrypt from 'bcryptjs';

export class UsersService {
  private repository: UsersRepository;

  constructor() {
    this.repository = new UsersRepository();
  }

  /**
   * الحصول على مستخدم بواسطة المعرف
   */
  async getUserById(id: string): Promise<IUser | undefined> {
    return this.repository.getUserById(id);
  }

  /**
   * البحث عن مستخدم بواسطة اسم المستخدم
   */
  async getUserByUsername(username: string): Promise<IUser | undefined> {
    return this.repository.getUserByUsername(username);
  }

  /**
   * البحث عن مستخدم بواسطة البريد الإلكتروني
   */
  async getUserByEmail(email: string): Promise<IUser | undefined> {
    return this.repository.getUserByEmail(email);
  }

  /**
   * تسجيل الدخول
   */
  async login(username: string, password: string): Promise<IUser | null> {
    // البحث عن المستخدم بواسطة اسم المستخدم
    const user = await this.getUserByUsername(username);
    
    if (!user) {
      return null;
    }
    
    // التحقق من كلمة المرور
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return null;
    }
    
    return user;
  }



  /**
   * إنشاء مستخدم جديد
   */
  async createUser(userData: IUser): Promise<IUser> {
    // التحقق من عدم وجود مستخدم بنفس اسم المستخدم
    const existingUsername = await this.getUserByUsername(userData.username);
    if (existingUsername) {
      throw new Error('اسم المستخدم مستخدم بالفعل');
    }
    
    // التحقق من عدم وجود مستخدم بنفس البريد الإلكتروني
    const existingEmail = await this.getUserByEmail(userData.email);
    if (existingEmail) {
      throw new Error('البريد الإلكتروني مستخدم بالفعل');
    }
    
    // تشفير كلمة المرور
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    // إنشاء المستخدم مع كلمة المرور المشفرة
    return this.repository.createUser({
      ...userData,
      password: hashedPassword,
      role: 'admin'
    });
  }

  /**
   * الحصول على قائمة المستخدمين
   */
  async listUsers(): Promise<IUser[]> {
    return this.repository.listUsers();
  }

  /**
   * تحديث بيانات مستخدم
   */
  async updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
    // التحقق من وجود المستخدم
    const existingUser = await this.getUserById(userId);
    if (!existingUser) {
      return null;
    }

    // إذا كان هناك تحديث لاسم المستخدم، تحقق من عدم تكراره
    if (userData.username && userData.username !== existingUser.username) {
      const existingUsername = await this.getUserByUsername(userData.username);
      if (existingUsername) {
        throw new Error('اسم المستخدم مستخدم بالفعل');
      }
    }

    // إذا كان هناك تحديث للبريد الإلكتروني، تحقق من عدم تكراره
    if (userData.email && userData.email !== existingUser.email) {
      const existingEmail = await this.getUserByEmail(userData.email);
      if (existingEmail) {
        throw new Error('البريد الإلكتروني مستخدم بالفعل');
      }
    }

    // إذا كان هناك تحديث لكلمة المرور، قم بتشفيرها
    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }

    const updatedUser = await this.repository.updateUser(userId.toString(), userData);
    return updatedUser || null;
  }

  /**
   * حذف مستخدم
   */
  async deleteUser(userId: string): Promise<boolean> {
    // التحقق من وجود المستخدم
    const existingUser = await this.getUserById(userId);
    if (!existingUser) {
      return false;
    }

    return this.repository.deleteUser(userId.toString());
  }

  /**
   * الحصول على جميع المستخدمين
   */
  async getAllUsers(): Promise<IUser[]> {
    return this.listUsers();
  }

  /**
   * التحقق مما إذا كان المستخدم مسؤولاً
   */
  isAdmin(user: IUser): boolean {
    return user.role === 'admin';
  }
}
