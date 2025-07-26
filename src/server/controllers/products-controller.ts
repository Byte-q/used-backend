import { Request, Response } from 'express';
import { ProductsService } from '../services/products-service';
import { insertProductSchema } from '../../shared/schema';

export class ProductsController {
  private productsService: ProductsService;

  constructor() {
    this.productsService = new ProductsService();
  }

  async listProducts(req: Request, res: Response): Promise<void> {
    try {      
      const products = await this.productsService.getAllProducts();
      
      res.json({
        success: true,
        data: products,
        totalProducts: products.length,
        message: 'تم جلب المنتجات بنجاح'
      });
    } catch (error) {
      console.error('Error in listProducts:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب المنتجات'
      });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productsService.getProductById(id);
      res.json({
        success: true,
        data: product,
        message: 'تم جلب المنتج بنجاح'
      });
    } catch (error: any) {
      console.error('Error in getProductById:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب المنتج',
        error: error.message
      });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productsService.updateProduct(id, req.body);
      res.json({
        success: true,
        data: product,
        message: 'تم تحديث المنتج بنجاح'
      });
    } catch (error: any) {
      console.error('Error in updateProduct:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في تحديث المنتج',
        error: error.message
      });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productsService.deleteProduct(id);
      res.json({
        success: true,
        data: product,
        message: 'تم حذف المنتج بنجاح'
      });
    } catch (error: any) {
      console.error('Error in deleteProduct:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في حذف المنتج',
        error: error.message
      });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = insertProductSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'بيانات غير صحيحة',
          errors: validationResult.error.errors
        });
        return;
      }

      const productData = validationResult.data;
      const newProduct = await this.productsService.createProduct(productData);
      
      res.status(201).json({
        success: true,
        data: newProduct,
        message: 'تم إنشاء المنتج بنجاح'
      });
    } catch (error: any) {
      console.error('Error in createProduct:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'خطأ في إنشاء المنتج'
      });
    }
  }
} 