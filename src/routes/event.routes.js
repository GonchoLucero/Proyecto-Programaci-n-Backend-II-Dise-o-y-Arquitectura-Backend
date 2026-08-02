import { Router } from 'express';
import {
    getAll,
    getById,
    createEvent,
    updateEvent,
    updateEventStatus,
} from '../controllers/event.controller.js';
import { createTicket, getEventTickets } from '../controllers/ticket.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authMiddleware, authorize(['organizer', 'admin']), createEvent);
router.put('/:id', authMiddleware, authorize(['organizer', 'admin']), updateEvent);
router.patch('/:id/status', authMiddleware, authorize(['organizer', 'admin']), updateEventStatus);
router.post('/:eid/tickets', authMiddleware, createTicket);
router.get('/:eid/tickets', authMiddleware, authorize(['organizer', 'admin']), getEventTickets);

export default router;
