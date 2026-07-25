import { Router } from 'express';
import { getAll, createEvent, updateEvent } from '../controllers/event.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';

const router = Router();

router.get('/', getAll);

router.post('/', authMiddleware, authorize(['organizer', 'admin']), createEvent);

router.put('/:id', authMiddleware, authorize(['organizer', 'admin']), updateEvent);

export default router;
