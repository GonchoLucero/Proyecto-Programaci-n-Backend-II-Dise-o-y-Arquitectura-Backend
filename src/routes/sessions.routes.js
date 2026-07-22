import { Router } from 'express';
import { register, login, current } from '../controllers/sessions.controller.js';

const router = Router();

// Estructura inicial de rutas de sesión.
// La lógica de autenticación (JWT, cookies, Passport) se agrega en próximas entregas.
router.post('/register', register);
router.post('/login', login);
router.get('/current', current);

export default router;
