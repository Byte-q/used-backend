import { ObjectId } from 'mongodb';
import dbConnect from '../../lib/mongodb';
import { IUser } from '../models/User'

export class UsersRepository {
  /**
   * الحصول على مستخدم بواسطة المعرف
   */
  async getUserById(id: string): Promise<IUser | undefined> {
    const db = await dbConnect();
    const user = await db.connection.collection('custmors').findOne({ _id: new ObjectId(id) });
    return user ? (user as IUser) : undefined;
  }

  /**
   * البحث عن مستخدم بواسطة اسم المستخدم
   */
  async getUserByUsername(username: string): Promise<IUser | undefined> {
    const db = await dbConnect();
    const user = await db.connection.collection('custmors').findOne({ username });
    // const user = await db.connection.collection('users').findOne({ username });
    return user ? (user as IUser) : undefined;
  }

  /**
   * البحث عن مستخدم بواسطة البريد الإلكتروني
   */
  async getUserByEmail(email: string): Promise<IUser | undefined> {
    const db = await dbConnect();
    const user = await db.connection.collection('custmors').findOne({ email });
    return user ? (user as IUser) : undefined;
  }

  /**
   * إنشاء مستخدم جديد
   */
  async createUser(userData: any): Promise<IUser> {
    const db = await dbConnect();
    const result = await db.connection.collection('custmors').insertOne(userData);
    // const result = user.ops[0];
    return { _id: result.insertedId.toString(), ...userData };
  }

  /**
   * تحديث بيانات مستخدم
   */
  async updateUser(id: string, userData: Partial<IUser>): Promise<any | undefined> {
    const db = await dbConnect();
    await db.connection.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: userData }
    );

    const user = await db.connection.collection('custmors').findOne({ _id: new ObjectId(id) });
    return user ? (user as IUser) : undefined;
  }

  /**
   * حذف مستخدم
   */
  async deleteUser(id: string): Promise<boolean> {
    const db = await dbConnect();
    const result = await db.connection.collection('custmors').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  /**
   * الحصول على قائمة المستخدمين
   */
  async listUsers(): Promise<IUser[]> {
    const db = await dbConnect();
    return (await db.connection.collection('custmors').find().toArray()) as IUser[];
  }
}
