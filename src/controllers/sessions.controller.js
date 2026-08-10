import { generateToken } from '../utils/jwt.js';
import { env } from '../config/env.js';
import { userDTO } from '../dto/user.dto.js';

export async function register(req, res, next) {
    try {
        res.status(201).json({ status: 'success', payload: userDTO(req.user) });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const { id, email, role } = req.user;

        const token = generateToken({ id, email, role });

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
        res.status(200).json({ status: 'success', payload: userDTO(req.user) });
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
