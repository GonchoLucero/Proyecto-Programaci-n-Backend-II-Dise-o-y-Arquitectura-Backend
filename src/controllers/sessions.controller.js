// Controller de sessions.
// Estructura inicial nada más: todavía no hay registro, login, JWT,
// cookies ni Passport (se incorporan en las próximas entregas).

export async function register(req, res, next) {
    try {
        res.status(501).json({ status: 'pending', message: 'Registro no implementado todavía' });
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
        res.status(501).json({ status: 'pending', message: 'Sesión actual no implementada todavía' });
    } catch (error) {
        next(error);
    }
}
