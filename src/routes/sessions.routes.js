import { Router } from 'express';
import { register, login, current, logout } from '../controllers/sessions.controller.js';
import { authenticate } from '../config/passport.config.js';

const router = Router();

function ensureCredentialsPresent(req, res, next) {
    req.body.email ??= ' ';
    req.body.password ??= ' ';
    next();
}

router.post('/register', ensureCredentialsPresent, authenticate('register'), register);
router.post('/login', ensureCredentialsPresent, authenticate('login'), login);
router.get('/current', authenticate('current'), current);
router.post('/logout', logout);

export default router;
