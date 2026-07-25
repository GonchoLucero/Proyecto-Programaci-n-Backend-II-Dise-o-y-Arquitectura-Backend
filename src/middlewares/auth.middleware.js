import { authenticate } from '../config/passport.config.js';

export const authMiddleware = authenticate('current');
