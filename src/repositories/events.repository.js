import eventsDao from '../dao/events.dao.js';

class EventsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAll(params) {
        return this.dao.getAll(params);
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
