import eventsRepository from '../repositories/events.repository.js';
import { AppError } from '../utils/errors.js';
import { EVENT_STATUSES } from '../utils/constants.js';

const DEFAULT_LIMIT = 10;

class EventsService {
    constructor(repository) {
        this.repository = repository;
    }

    async listEvents(query = {}) {
        const { status, category, location, dateFrom, dateTo, page, limit, sort } = query;

        const filters = {};
        if (status) filters.status = status;
        if (category) filters.category = category;
        if (location) filters.location = location;
        if (dateFrom || dateTo) {
            filters.date = {};
            if (dateFrom) filters.date.$gte = new Date(dateFrom);
            if (dateTo) filters.date.$lte = new Date(dateTo);
        }

        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.max(parseInt(limit, 10) || DEFAULT_LIMIT, 1);
        const skip = (pageNum - 1) * limitNum;

        const sortObj = {};
        if (sort) {
            const field = sort.startsWith('-') ? sort.slice(1) : sort;
            sortObj[field] = sort.startsWith('-') ? -1 : 1;
        }

        const { data, total } = await this.repository.getAll({
            filters,
            skip,
            limit: limitNum,
            sort: sortObj,
        });

        return {
            data,
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: limitNum > 0 ? Math.ceil(total / limitNum) : 0,
        };
    }

    async getEventById(id) {
        const event = await this.repository.getById(id);
        if (!event) {
            throw new AppError('Evento no encontrado', 404);
        }
        return event;
    }

    async createEvent(eventData, organizerId) {
        const { title, description, category, date, location, capacity, price } = eventData;

        if (!title || !description || !category || !location) {
            throw new AppError('Faltan campos obligatorios', 400);
        }

        if (!date || Number.isNaN(new Date(date).getTime())) {
            throw new AppError('La fecha del evento es inválida', 400);
        }

        if (new Date(date) < new Date()) {
            throw new AppError('La fecha del evento no puede ser en el pasado', 400);
        }

        if (capacity === undefined || capacity <= 0) {
            throw new AppError('La capacidad debe ser mayor a 0', 400);
        }

        if (price === undefined || price < 0) {
            throw new AppError('El precio no puede ser negativo', 400);
        }

        return this.repository.create({
            title,
            description,
            category,
            date,
            location,
            capacity,
            price,
            organizer: organizerId,
        });
    }

    async updateEvent(id, updates, currentUser) {
        const event = await this.getEventById(id);

        this._assertOwnership(event, currentUser);
        this._assertNotCancelled(event);

        if (updates.capacity !== undefined && updates.capacity <= 0) {
            throw new AppError('La capacidad debe ser mayor a 0', 400);
        }

        if (updates.price !== undefined && updates.price < 0) {
            throw new AppError('El precio no puede ser negativo', 400);
        }

        if (updates.date !== undefined && new Date(updates.date) < new Date()) {
            throw new AppError('La fecha del evento no puede ser en el pasado', 400);
        }

        const { organizer, status, ...safeUpdates } = updates;

        return this.repository.update(id, safeUpdates);
    }

    async updateEventStatus(id, newStatus, currentUser) {
        if (!EVENT_STATUSES.includes(newStatus)) {
            throw new AppError('Estado inválido', 400);
        }

        const event = await this.getEventById(id);

        this._assertOwnership(event, currentUser);
        this._assertNotCancelled(event);

        if (newStatus === 'published' && ['finished', 'cancelled'].includes(event.status)) {
            throw new AppError('No se puede publicar un evento finalizado o cancelado', 400);
        }

        return this.repository.update(id, { status: newStatus });
    }

    _assertOwnership(event, currentUser) {
        const isOwner = event.organizer?.toString() === currentUser.id;
        const isAdmin = currentUser.role === 'admin';

        if (!isOwner && !isAdmin) {
            throw new AppError('No podés modificar un evento que no te pertenece', 403);
        }
    }

    _assertNotCancelled(event) {
        if (event.status === 'cancelled') {
            throw new AppError('No se puede modificar un evento cancelado', 400);
        }
    }
}

export default new EventsService(eventsRepository);
