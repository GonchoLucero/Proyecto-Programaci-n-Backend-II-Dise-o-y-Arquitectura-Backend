import express from 'express';
import cookieParser from 'cookie-parser';

import userRouter from './routes/user.routes.js';
import ticketRouter from './routes/ticket.routes.js';
import eventRouter from './routes/event.routes.js';
import sessionsRouter from './routes/sessions.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Healthcheck
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Servidor activo' });
});

// Rutas de recursos
app.use('/api/events', eventRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', userRouter);
app.use('/api/tickets', ticketRouter);

// Manejo de rutas no encontradas y errores
app.use(notFoundHandler);
app.use(errorHandler);

export default app;