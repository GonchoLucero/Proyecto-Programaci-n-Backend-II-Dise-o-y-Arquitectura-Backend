import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';

import sessionsService from '../services/sessions.service.js';
import { AppError } from '../utils/errors.js';
import { env } from './env.js';

const cookieExtractor = (req) => req?.cookies?.currentUser || null;

export function initPassport() {
    passport.use(
        'register',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true,
            },
            async (req, _email, _password, done) => {
                try {
                    const newUser = await sessionsService.register(req.body);
                    return done(null, newUser);
                } catch (error) {
                    if (error instanceof AppError) {
                        return done(null, false, {
                            status: error.status,
                            message: error.message,
                        });
                    }
                    return done(error);
                }
            }
        )
    );

    passport.use(
        'login',
        new LocalStrategy(
            { usernameField: 'email', passwordField: 'password' },
            async (email, password, done) => {
                try {
                    const user = await sessionsService.login({ email, password });
                    return done(null, user);
                } catch (error) {
                    if (error instanceof AppError) {
                        return done(null, false, {
                            status: error.status,
                            message: error.message,
                        });
                    }
                    return done(error);
                }
            }
        )
    );

    passport.use(
        'current',
        new JwtStrategy(
            {
                jwtFromRequest: cookieExtractor,
                secretOrKey: env.JWT_SECRET,
            },
            (jwtPayload, done) => {
                return done(null, jwtPayload);
            }
        )
    );
}

export function authenticate(strategyName) {
    return (req, res, next) => {
        passport.authenticate(strategyName, { session: false }, (err, user, info) => {
            if (err) return next(err);

            if (!user) {
                const hasControlledInfo = info && typeof info === 'object' && 'status' in info;
                const status = hasControlledInfo ? info.status : 401;
                const message = hasControlledInfo ? info.message : 'No autenticado';
                return res.status(status).json({ status: 'error', message });
            }

            req.user = user;
            next();
        })(req, res, next);
    };
}

export default passport;
