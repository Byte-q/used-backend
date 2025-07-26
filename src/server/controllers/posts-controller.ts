import { Request, Response } from 'express';
import { PostsService } from '../services/posts-service';
import { insertPostSchema } from '../../shared/schema';

export class PostsController {
  private postsService: PostsService;

  constructor() {
    this.postsService = new PostsService();
  }

  async listPosts(req: Request, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '10', category, search } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      
      const posts = await this.postsService.getPosts({
        page: pageNum,
        limit: limitNum,
        category: category as string,
        search: search as string
      });
      
      res.json({
        success: true,
        data: posts,
        totalPosts: posts.length,
        totalPages: Math.ceil(posts.length / limitNum),
        message: 'تم جلب المقالات بنجاح'
      });
    } catch (error) {
      console.error('Error in listPosts:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب المقالات'
      });
    }
  }

  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const post = await this.postsService.getPostById(id);
      res.json({
        success: true,
        data: post,
        message: 'تم جلب المقال بنجاح'
      });
    } catch (error: any) {
      console.error('Error in getPostById:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب المقال',
        error: error.message
      });
    }
  }

  async getPostsByTag(req: Request, res: Response): Promise<void> {
    try {
      const { tag } = req.params;
      const posts = await this.postsService.getPostsByTag(tag);
      res.json({
        success: true,
        data: posts,
        message: 'تم جلب المقالات بنجاح'
      });
    } catch (error: any) {
      console.error('Error in getPostByTag:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب المقالات',
        error: error.message
      });
    }
  }

  async getPostTags(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tags = await this.postsService.getPostTags(id);
      res.json({
        success: true,
        data: tags,
        message: 'تم جلب علامات المقال بنجاح'
      });
    } catch (error: any) {
      console.error('Error in getPostTags:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب علامات المقال',
        error: error.message
      });
    }
  }

  async addTagToPost(req: Request, res: Response): Promise<void> {
    try {
      const { postId, tagId } = req.params;
      const post = await this.postsService.addTagToPost(postId, tagId);
      res.json({
        success: true,
        data: post,
        message: 'تم إضافة العلامة إلى المقال بنجاح'
      });
    } catch (error: any) {
      console.error('Error in addTagToPost:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في إضافة العلامة إلى المقال',
        error: error.message
      });
    }
  }

  async removeTagFromPost(req: Request, res: Response): Promise<void> {
    try {
      const { postId, tagId } = req.params;
      const post = await this.postsService.removeTagFromPost(postId, tagId);
      res.json({
        success: true,
        data: post,
        message: 'تم إزالة العلامة من المقال بنجاح'
      });
    } catch (error: any) {
      console.error('Error in removeTagFromPost:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في إزالة العلامة من المقال',
        error: error.message
      });
    }
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const post = await this.postsService.updatePost(id, req.body);
      res.json({
        success: true,
        data: post,
        message: 'تم تحديث المقال بنجاح'
      });
    } catch (error: any) {
      console.error('Error in updatePost:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في تحديث المقال',
        error: error.message
      });
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const post = await this.postsService.deletePost(id);
      res.json({
        success: true,
        data: post,
        message: 'تم حذف المقال بنجاح'
      });
    } catch (error: any) {
      console.error('Error in deletePost:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في حذف المقال',
        error: error.message
      });
    }
  }

  async getFeaturedPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await this.postsService.getFeaturedPosts();
      res.json({
        success: true,
        data: posts,
        message: 'تم جلب المقالات المميزة بنجاح'
      });
    } catch (error) {
      console.error('Error in getFeaturedPosts:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب المقالات المميزة'
      });
    }
  }

  async getPostBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const post = await this.postsService.getPostBySlug(slug);
      
      if (!post) {
        res.status(404).json({
          success: false,
          message: 'المقال غير موجود'
        });
        return;
      }

      res.json({
        success: true,
        data: post,
        message: 'تم جلب بيانات المقال بنجاح'
      });
    } catch (error) {
      console.error('Error in getPostBySlug:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب بيانات المقال'
      });
    }
  }

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = insertPostSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'بيانات غير صحيحة',
          errors: validationResult.error.errors
        });
        return;
      }

      const postData = validationResult.data;
      const newPost = await this.postsService.createPost(postData);
      
      res.status(201).json({
        success: true,
        data: newPost,
        message: 'تم إنشاء المقال بنجاح'
      });
    } catch (error: any) {
      console.error('Error in createPost:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'خطأ في إنشاء المقال'
      });
    }
  }
} 