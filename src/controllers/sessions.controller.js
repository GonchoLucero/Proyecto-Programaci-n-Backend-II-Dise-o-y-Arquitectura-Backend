import sessionsService from '../services/sessions.service.js';
import { env } from '../config/env.js';

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
        const token = await sessionsService.login(req.body);

        res.cookie('currentUser', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 3600000,
            secure: env.NODE_ENV === 'production',
        });

        res.status(200).json({ status: 'success', message: 'Login correcto' });
    } catch (error) {
        next(error);
    }
}

export async function current(req, res, next) {
    try {
        const { id, email, role } = req.user;
        res.status(200).json({ status: 'success', payload: { id, email, role } });
    } catch (error) {
        next(error);
    }
}

export async function logout(req, res, next) {
    try {
        res.clearCookie('currentUser');
        res.status(200).json({ status: 'success', message: 'Sesión cerrada' });
    } catch (error) {
        next(error);
    }
}
