import ticketsRepository from '../repositories/tickets.repository.js';
import eventsRepository from '../repositories/events.repository.js';
import usersRepository from '../repositories/users.repository.js';
import { sendTicketConfirmationEmail } from '../utils/mailer.js';
import { AppError } from '../utils/errors.js';

class TicketsService {
    constructor(repository) {
        this.repository = repository;
    }

    async createTicket(eventId, currentUser, rawQuantity) {
        const event = await eventsRepository.getById(eventId);
        if (!event) {
            throw new AppError('Evento no encontrado', 404);
        }

        if (event.status !== 'published') {
            throw new AppError('El evento no está disponible para inscripciones', 400);
        }

        const quantity = rawQuantity === undefined ? 1 : Number(rawQuantity);
        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new AppError('La cantidad debe ser un número entero mayor a 0', 400);
        }

        const existingTicket = await this.repository.findActiveByUserAndEvent(
            currentUser.id,
            eventId
        );
        if (existingTicket) {
            throw new AppError('Ya tenés una inscripción activa para este evento', 409);
        }

        const occupied = await this.repository.countActiveQuantityByEvent(eventId);
        const available = event.capacity - occupied;
        if (quantity > available) {
            throw new AppError(`No hay cupos suficientes: quedan ${available} disponible(s)`, 400);
        }

        const newTicket = await this.repository.create({
            user: currentUser.id,
            event: eventId,
            quantity,
        });

        const user = await usersRepository.findById(currentUser.id);
        await sendTicketConfirmationEmail({
            to: currentUser.email,
            userName: user?.first_name || currentUser.email,
            eventTitle: event.title,
            eventDate: event.date,
            quantity: newTicket.quantity,
            reservationCode: newTicket.reservationCode,
        });

        return newTicket;
    }

    listMyTickets(userId) {
        return this.repository.findByUser(userId);
    }

    async listEventTickets(eventId, currentUser) {
        const event = await eventsRepository.getById(eventId);
        if (!event) {
            throw new AppError('Evento no encontrado', 404);
        }

        const isOwner = event.organizer?.toString() === currentUser.id;
        const isAdmin = currentUser.role === 'admin';
        if (!isOwner && !isAdmin) {
            throw new AppError('No tenés permisos para ver las inscripciones de este evento', 403);
        }

        return this.repository.findByEvent(eventId);
    }

    async cancelTicket(ticketId, currentUser) {
        const ticket = await this.repository.findById(ticketId);
        if (!ticket) {
            throw new AppError('Ticket no encontrado', 404);
        }

        const isOwner = ticket.user?.toString() === currentUser.id;
        const isAdmin = currentUser.role === 'admin';
        if (!isOwner && !isAdmin) {
            throw new AppError('No podés cancelar un ticket que no te pertenece', 403);
        }

        if (ticket.status === 'cancelled') {
            throw new AppError('El ticket ya está cancelado', 400);
        }

        return this.repository.update(ticketId, {
            status: 'cancelled',
            cancelledAt: new Date(),
        });
    }
}

export default new TicketsService(ticketsRepository);
