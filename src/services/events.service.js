import eventsRepository from '../repositories/events.repository.js';
import { AppError } from '../utils/errors.js';

class EventsService {
    constructor(repository) {
        this.repository = repository;
    }

    getAllEvents() {
        return this.repository.getAll();
    }

    getEventById(id) {
        return this.repository.getById(id);
    }

    createEvent(eventData, organizerId) {
        return this.repository.create({ ...eventData, organizer: organizerId });
    }

    async updateEvent(id, updates, currentUser) {
        const event = await this.repository.getById(id);

        if (!event) {
            throw new AppError('Evento no encontrado', 404);
        }

        const isOwner = event.organizer?.toString() === currentUser.id;
        const isAdmin = currentUser.role === 'admin';

        if (!isOwner && !isAdmin) {
            throw new AppError('No podés modificar un evento que no te pertenece', 403);
        }

        const { organizer, ...safeUpdates } = updates;

        return this.repository.update(id, safeUpdates);
    }
}

export default new EventsService(eventsRepository);
