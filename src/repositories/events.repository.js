import eventsDao from '../dao/events.dao.js';

// El Repository desacopla al Service del DAO concreto (y de Mongoose).
class EventsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAll() {
        return this.dao.getAll();
    }

    getById(id) {
        return this.dao.getById(id);
    }

    create(eventData) {
        return this.dao.create(eventData);
    }

    update(id, updates) {
        return this.dao.update(id, updates);
    }
}

export default new EventsRepository(eventsDao);
