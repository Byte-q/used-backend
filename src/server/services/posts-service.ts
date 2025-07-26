import { PostsRepository } from "../repositories/posts-repository";
import { Post } from "../../shared/schema";

export class PostsService {
  private postsRepository: PostsRepository;

  constructor() {
    this.postsRepository = new PostsRepository();
  }

  async getAllPosts() {
    return this.postsRepository.listPosts();
  }

  async getPostById(id: string) {
    return this.postsRepository.getPostById(id);
  }

  async createPost(data: any) {
    return this.postsRepository.createPost(data);
  }

  async updatePost(id: string, data: any) {
    return this.postsRepository.updatePost(id, data);
  }

  async deletePost(id: string) {
    return this.postsRepository.deletePost(id);
  }

  /**
   * الحصول على مقال بواسطة الاسم المستعار
   */
  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return this.postsRepository.getPostBySlug(slug);
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
    console.log("Posts Service - listPosts filters:", filters);
    return this.postsRepository.listPosts(filters);
  }

  /**
   * زيادة عدد مشاهدات مقال
   */
  async incrementPostViews(id: string): Promise<boolean> {
    return this.postsRepository.incrementPostViews(id);
  }

  /**
   * الحصول على مقالات حسب علامة
   */
  async getPostsByTag(tagSlug: string): Promise<Post[]> {
    return this.postsRepository.getPostsByTagSlug(tagSlug);
  }

  /**
   * إضافة علامة إلى مقال
   */
  async addTagToPost(postId: string, tagId: string): Promise<any> {
    return this.postsRepository.addTagToPost(postId, tagId);
  }

  /**
   * إزالة علامة من مقال
   */
  async removeTagFromPost(postId: string, tagId: string): Promise<boolean> {
    return this.postsRepository.removeTagFromPost(postId, tagId);
  }

  /**
   * الحصول على علامات مقال
   */
  async getPostTags(postId: string): Promise<any[]> {
    return this.postsRepository.getPostTags(postId);
  }

  /**
   * الحصول على المقالات المميزة
   */
  async getFeaturedPosts(): Promise<Post[]> {
    return this.postsRepository.listPosts({ isFeatured: true });
  }

  /**
   * الحصول على المقالات مع خيارات البحث والتصفية
   */
  async getPosts(options: {
    page: number;
    limit: number;
    category?: string;
    search?: string;
  }): Promise<Post[]> {
    // يمكن إضافة منطق البحث والتصفية هنا
    // للآن، نستخدم listPosts الأساسي
    return this.postsRepository.listPosts();
  }

  /**
   * توليد اسم مستعار من العنوان
   * وظيفة مساعدة لإنشاء اسم مستعار من عنوان المقال
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')       // استبدال المسافات بشرطات
      .replace(/[^\u0621-\u064A\u0660-\u0669a-z0-9-]/g, '') // إزالة الأحرف غير العربية والإنجليزية والأرقام والشرطات
      .replace(/-+/g, '-')        // استبدال الشرطات المتعددة بشرطة واحدة
      .replace(/^-+/, '')         // إزالة الشرطات من بداية النص
      .replace(/-+$/, '');        // إزالة الشرطات من نهاية النص
  }
}
