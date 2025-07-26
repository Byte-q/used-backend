import { ObjectId } from 'mongodb';
import dbConnect from '../../lib/mongodb';

export class PostsRepository {
  /**
   * الحصول على مقال بواسطة المعرف
   */
  async getPostById(id: string): Promise<any | undefined> {
    try {
      const db = await dbConnect();
      return await db.connection.collection('posts').findOne({ _id: new ObjectId(id) }) || undefined;
    } catch (error) {
      console.error("Error in getPostById:", error);
      throw error;
    }
  }

  /**
   * الحصول على مقال بواسطة الاسم المستعار
   */
  async getPostBySlug(slug: string): Promise<any | undefined> {
    try {
      const db = await dbConnect();
      return await db.connection.collection('posts').findOne({ slug }) || undefined;
    } catch (error) {
      console.error("Error in getPostBySlug:", error);
      throw error;
    }
  }

  /**
   * إنشاء مقال جديد
   */
  async createPost(postData: any): Promise<any> {
    try {
      const db = await dbConnect();
      const result = await db.connection.collection('posts').insertOne(postData);
      return { _id: result.insertedId, ...postData };
    } catch (error) {
      console.error("Error in createPost:", error);
      throw error;
    }
  }

  /**
   * تحديث مقال
   */
  async updatePost(id: string, postData: Partial<any>): Promise<any | undefined> {
    try {
      const db = await dbConnect();
      await db.connection.collection('posts').updateOne(
        { _id: new ObjectId(id) },
        { $set: postData }
      );
      return db.connection.collection('posts').findOne({ _id: new ObjectId(id) }) || undefined;
    } catch (error) {
      console.error("Error in updatePost:", error);
      throw error;
    }
  }

  /**
   * حذف مقال
   */
  async deletePost(id: string): Promise<boolean> {
    try {
      const db = await dbConnect();
      // حذف العلاقات مع العلامات أولاً
      await db.connection.collection('postTags').deleteMany({ postId: new ObjectId(id) });
      // ثم حذف المقال نفسه
      const result = await db.connection.collection('posts').deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      console.error("Error in deletePost:", error);
      throw error;
    }
  }

  /**
   * الحصول على قائمة المقالات
   * يمكن تصفية النتائج حسب المعايير المقدمة
   */
  async listPosts(filters?: {
    authorId?: string,
    isFeatured?: boolean,
    status?: string,
    tag?: string,
    limit?: number
  }): Promise<any[]> {
    try {
      const db = await dbConnect();
      const query: any = {};
      if (filters?.authorId) query.authorId = new ObjectId(filters.authorId);
      if (filters?.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
      if (filters?.status) query.status = filters.status;
      let posts = await db.connection.collection('posts').find(query).sort({ createdAt: -1 }).limit(filters?.limit || 0).toArray();
      // إذا كان هناك تصفية حسب العلامة، نقوم بمعالجتها بشكل منفصل
      if (filters?.tag) {
        const tagPosts = await this.getPostsByTagSlug(filters.tag);
        const tagPostIds = tagPosts.map(post => post._id.toString());
        posts = posts.filter((post: any) => tagPostIds.includes(post._id.toString()));
      }
      return posts;
    } catch (error) {
      console.error("Error in listPosts:", error);
      throw error;
    }
  }

  /**
   * زيادة عدد مشاهدات مقال
   */
  async incrementPostViews(id: string): Promise<boolean> {
    try {
      const db = await dbConnect();
      const post = await this.getPostById(id);
      if (!post) {
        return false;
      }
      const currentViews = post.views || 0;
      const result = await db.connection.collection('posts').updateOne(
        { _id: new ObjectId(id) },
        { $set: { views: currentViews + 1 } }
      );
      return result.modifiedCount === 1;
    } catch (error) {
      console.error("Error in incrementPostViews:", error);
      throw error;
    }
  }

  /**
   * الحصول على مقالات حسب علامة
   */
  async getPostsByTagSlug(tagSlug: string): Promise<any[]> {
    try {
      const db = await dbConnect();
      // أولاً، نحصل على العلامة بواسطة الاسم المستعار
      const tag = await db.connection.collection('tags').findOne({ slug: tagSlug });
      if (!tag) {
        return [];
      }
      // ثم نحصل على جميع علاقات المقالات بهذه العلامة
      const relationships = await db.connection.collection('postTags').find({ tagId: tag._id }).toArray();
      // أخيراً، نحصل على المقالات المرتبطة
      const postIds = relationships.map((rel: any) => rel.postId);
      if (postIds.length === 0) {
        return [];
      }
      return await db.connection.collection('posts').find({ _id: { $in: postIds } }).sort({ createdAt: -1 }).toArray();
    } catch (error) {
      console.error("Error in getPostsByTagSlug:", error);
      throw error;
    }
  }

  /**
   * إضافة علامة إلى مقال
   */
  async addTagToPost(postId: string, tagId: string): Promise<any> {
    try {
      const db = await dbConnect();
      // التحقق من عدم وجود العلاقة مسبقاً
      const existing = await db.connection.collection('postTags').findOne({ postId: new ObjectId(postId), tagId: new ObjectId(tagId) });
      if (existing) {
        return existing;
      }
      // إنشاء العلاقة
      const result = await db.connection.collection('postTags').insertOne({ postId: new ObjectId(postId), tagId: new ObjectId(tagId) });
      return { _id: result.insertedId, postId, tagId };
    } catch (error) {
      console.error("Error in addTagToPost:", error);
      throw error;
    }
  }

  /**
   * إزالة علامة من مقال
   */
  async removeTagFromPost(postId: string, tagId: string): Promise<boolean> {
    try {
      const db = await dbConnect();
      const result = await db.connection.collection('postTags').deleteOne({ postId: new ObjectId(postId), tagId: new ObjectId(tagId) });
      return result.deletedCount === 1;
    } catch (error) {
      console.error("Error in removeTagFromPost:", error);
      throw error;
    }
  }

  /**
   * الحصول على علامات مقال
   */
  async getPostTags(postId: string): Promise<any[]> {
    try {
      const db = await dbConnect();
      const relationships = await db.connection.collection('postTags').find({ postId: new ObjectId(postId) }).toArray();
      if (relationships.length === 0) {
        return [];
      }
      const tagIds = relationships.map((rel: any) => rel.tagId);
      return await db.connection.collection('tags').find({ _id: { $in: tagIds } }).toArray();
    } catch (error) {
      console.error("Error in getPostTags:", error);
      throw error;
    }
  }
}
