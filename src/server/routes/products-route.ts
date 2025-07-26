import { Router } from 'express';
import { ProductsController } from '../controllers/products-controller';
import { isAdmin } from '../middlewares/auth-middleware';

const router = Router();
const controller = new ProductsController();

// الحصول على قائمة المقالات
router.get('/', (req, res) => controller.listProducts(req, res));

// الحصول على مقال بواسطة المعرف
router.get('/:id([0-9]+)', (req, res) => controller.getProductById(req, res));

// إنشاء مقال جديد (يتطلب صلاحيات المسؤول)
router.post('/', (req, res) => controller.createProduct(req, res));

// تحديث مقال (يتطلب صلاحيات المسؤول)
router.put('/:id', (req, res) => controller.updateProduct(req, res));

// تحديث جزئي لمقال (يتطلب صلاحيات المسؤول)
router.patch('/:id', (req, res) => controller.updateProduct(req, res));

// حذف مقال (يتطلب صلاحيات المسؤول)
router.delete('/:id', (req, res) => controller.deleteProduct(req, res));

export default router;
