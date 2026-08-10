import ticketsService from '../services/tickets.service.js';
import { ticketDTO, ticketListDTO } from '../dto/ticket.dto.js';

export async function createTicket(req, res, next) {
    try {
        const newTicket = await ticketsService.createTicket(
            req.params.eid,
            req.user,
            req.body.quantity
        );
        res.status(201).json({ status: 'success', payload: ticketDTO(newTicket) });
    } catch (error) {
        next(error);
    }
}

export async function getMyTickets(req, res, next) {
    try {
        const tickets = await ticketsService.listMyTickets(req.user.id);
        res.status(200).json({ status: 'success', payload: ticketListDTO(tickets) });
    } catch (error) {
        next(error);
    }
}

export async function getEventTickets(req, res, next) {
    try {
        const tickets = await ticketsService.listEventTickets(req.params.eid, req.user);
        res.status(200).json({ status: 'success', payload: ticketListDTO(tickets) });
    } catch (error) {
        next(error);
    }
}

export async function cancelTicket(req, res, next) {
    try {
        const cancelledTicket = await ticketsService.cancelTicket(req.params.tid, req.user);
        res.status(200).json({ status: 'success', payload: ticketDTO(cancelledTicket) });
    } catch (error) {
        next(error);
    }
}
