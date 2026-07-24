import { verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';

export function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.currentUser;

        if (!token) {
            throw new AppError('No autenticado', 401);
        }

        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        next(new AppError('No autenticado', 401));
    }
}