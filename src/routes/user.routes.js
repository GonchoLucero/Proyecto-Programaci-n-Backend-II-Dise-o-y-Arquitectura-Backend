import { Router } from 'express';
import { getAllUsers } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';

const router = Router();

router.get('/', authMiddleware, authorize(['admin']), getAllUsers);

export default router;
