import { Router } from 'express';
import { UsersController } from '../controllers/users-controller';
import { isAdmin, isAuthenticated } from '../middlewares/auth-middleware';

const router = Router();
const controller = new UsersController();

// الحصول على قائمة المستخدمين (للمسؤولين فقط)
router.get('/', (req, res) => controller.listUsers(req, res));


router.get('/user/:username', (req, res) => controller.getByUsername(req, res));

// الحصول على مستخدم بواسطة المعرف (للمسؤولين فقط)
router.get('/:id', (req, res) => controller.getUserById(req, res));

// إنشاء مستخدم جديد (للمسؤولين فقط)
router.post('/', (req, res) => controller.createUser(req, res));

// تحديث بيانات مستخدم (للمسؤولين فقط)
router.put('/:id', (req, res) => controller.updateUser(req, res));

// حذف مستخدم (للمسؤولين فقط)
router.delete('/:id', (req, res) => controller.deleteUser(req, res));

export default router;
