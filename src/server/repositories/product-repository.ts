import { ObjectId } from 'mongodb';
import dbConnect from '../../lib/mongodb';

export class ProductsRepository {
  /**
   * الحصول على مقال بواسطة المعرف
   */
  async getProductById(id: string): Promise<any | undefined> {
    try {
      const db = await dbConnect();
      return await db.connection.collection('products').findOne({ _id: new ObjectId(id) }) || undefined;
    } catch (error) {
      console.error("Error in getProductById:", error);
      throw error;
    }
  }

  /**
   * إنشاء مقال جديد
   */
  async createProduct(productData: any): Promise<any> {
    try {
      const db = await dbConnect();
      const result = await db.connection.collection('products').insertOne(productData);
      return { _id: result.insertedId, ...productData };
    } catch (error) {
      console.error("Error in createProduct:", error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<any>): Promise<any | undefined> {
    try {
      const db = await dbConnect();
      await db.connection.collection('products').updateOne(
        { _id: new ObjectId(id) },
        { $set: productData }
      );
      return db.connection.collection('products').findOne({ _id: new ObjectId(id) }) || undefined;
    } catch (error) {
      console.error("Error in updateProduct:", error);
      throw error;
    }
  }


  async deleteProduct(id: string): Promise<boolean> {
    try {
      const db = await dbConnect();
      // حذف العلاقات مع العلامات أولاً
      await db.connection.collection('productTags').deleteMany({ productId: new ObjectId(id) });
      // ثم حذف المقال نفسه
      const result = await db.connection.collection('products').deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      throw error;
    }
  }

 
  async listProducts(): Promise<any[]> {
    try {
      const db = await dbConnect();
      
      return await db.connection.collection('products').find().sort({ createdAt: -1 }).toArray();
    } catch (error) {
      console.error("Error in listProducts:", error);
      throw error;
    }
  }
}
