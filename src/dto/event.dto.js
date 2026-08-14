import { userDTO } from './user.dto.js';

function isPopulatedUser(value) {
    return value && typeof value === 'object' && 'email' in value;
}

export function eventDTO(event) {
    if (!event) return null;

    return {
        id: event._id?.toString?.() || event.id,
        title: event.title,
        description: event.description,
        category: event.category,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        price: event.price,
        status: event.status,
        organizer: isPopulatedUser(event.organizer) ? userDTO(event.organizer) : event.organizer,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
    };
}

export function eventListDTO(events = []) {
    return events.map(eventDTO);
}
