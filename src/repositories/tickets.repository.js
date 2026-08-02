import ticketsDao from '../dao/tickets.dao.js';

class TicketsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    create(ticketData) {
        return this.dao.create(ticketData);
    }

    findById(id) {
        return this.dao.findById(id);
    }

    findActiveByUserAndEvent(userId, eventId) {
        return this.dao.findActiveByUserAndEvent(userId, eventId);
    }

    countActiveQuantityByEvent(eventId) {
        return this.dao.countActiveQuantityByEvent(eventId);
    }

    findByUser(userId) {
        return this.dao.findByUser(userId);
    }

    findByEvent(eventId) {
        return this.dao.findByEvent(eventId);
    }

    update(id, updates) {
        return this.dao.update(id, updates);
    }
}

export default new TicketsRepository(ticketsDao);
