import sessionsService from '../services/sessions.service.js';

export async function register(req, res, next) {
    try {
        const newUser = await sessionsService.register(req.body);
        res.status(201).json({ status: 'success', payload: newUser });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        res.status(501).json({ status: 'pending', message: 'Login no implementado todavía' });
    } catch (error) {
        next(error);
    }
}

export async function current(req, res, next) {
    try {
        res.status(501).json({
            status: 'pending',
            message: 'Sesión actual no implementada todavía',
        });
    } catch (error) {
        next(error);
    }
}
