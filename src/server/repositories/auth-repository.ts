import { ObjectId } from 'mongodb';
import dbConnect from '../../lib/mongodb';

export class AuthRepository {
  /**
   * الحصول على المستخدم بواسطة معرفه
   * @param id معرف المستخدم
   * @returns بيانات المستخدم أو null إذا لم يكن موجوداً
   */
  async getUserById(id: string): Promise<any | null> {
    try {
      const db = await dbConnect();
      return (await db.collection('users').findOne({ _id: new ObjectId(id) })) || null;
    } catch (error) {
      console.error('Error in AuthRepository.getUserById:', error);
      throw error;
    }
  }

  /**
   * الحصول على المستخدم بواسطة اسم المستخدم
   * @param username اسم المستخدم
   * @returns بيانات المستخدم أو null إذا لم يكن موجوداً
   */
  async getUserByUsername(username: string): Promise<any | null> {
    try {
      const db = await dbConnect();
      return (await db.collection('users').findOne({ username })) || null;
    } catch (error) {
      console.error('Error in AuthRepository.getUserByUsername:', error);
      throw error;
    }
  }

  /**
   * الحصول على المستخدم بواسطة البريد الإلكتروني
   * @param email البريد الإلكتروني
   * @returns بيانات المستخدم أو null إذا لم يكن موجوداً
   */
  async getUserByEmail(email: string): Promise<any | null> {
    try {
      const db = await dbConnect();
      return (await db.collection('users').findOne({ email })) || null;
    } catch (error) {
      console.error('Error in AuthRepository.getUserByEmail:', error);
      throw error;
    }
  }

  /**
   * الحصول على قائمة المستخدمين
   * @returns قائمة المستخدمين
   */
  async getAllUsers(): Promise<any[]> {
    try {
      const db = await dbConnect();
      return await db.collection('users').find().toArray();
    } catch (error) {
      console.error('Error in AuthRepository.getAllUsers:', error);
      throw error;
    }
  }
}
