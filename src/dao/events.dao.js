import { eventModel } from '../models/event.model.js';

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

    async update(id, updates) {
        return eventModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    }
}

export default new EventsDao();
