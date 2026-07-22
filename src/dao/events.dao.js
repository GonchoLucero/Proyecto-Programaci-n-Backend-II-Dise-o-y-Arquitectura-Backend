import { eventModel } from '../models/event.model.js';

// DAO (Data Access Object): única capa que habla directamente con Mongoose.
class EventsDao {
    async getAll() {
        return eventModel.find();
    }

    async getById(id) {
        return eventModel.findById(id);
    }

    async create(eventData) {
        return eventModel.create(eventData);
    }
}

export default new EventsDao();
