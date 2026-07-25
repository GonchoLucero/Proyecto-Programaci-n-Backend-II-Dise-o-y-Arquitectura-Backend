import { AppError } from '../utils/errors.js';

export function authorize(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('No autenticado', 401));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError('No tenés permisos para realizar esta acción', 403));
        }

        next();
    };
}
