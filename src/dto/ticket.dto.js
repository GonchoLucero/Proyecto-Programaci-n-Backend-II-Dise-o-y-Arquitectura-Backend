import { userDTO } from './user.dto.js';

function isPopulatedUser(value) {
    return value && typeof value === 'object' && 'email' in value;
}

function isPopulatedEvent(value) {
    return value && typeof value === 'object' && 'title' in value;
}

function minimalEventDTO(event) {
    return {
        id: event._id?.toString?.() || event.id,
        title: event.title,
        date: event.date,
        location: event.location,
    };
}

export function ticketDTO(ticket) {
    if (!ticket) return null;

    return {
        id: ticket._id?.toString?.() || ticket.id,
        user: isPopulatedUser(ticket.user) ? userDTO(ticket.user) : ticket.user,
        event: isPopulatedEvent(ticket.event) ? minimalEventDTO(ticket.event) : ticket.event,
        status: ticket.status,
        quantity: ticket.quantity,
        reservationCode: ticket.reservationCode,
        createdAt: ticket.createdAt,
        cancelledAt: ticket.cancelledAt,
    };
}

export function ticketListDTO(tickets = []) {
    return tickets.map(ticketDTO);
}
