import { eventModel } from '../models/event.model.js';

class EventsDao {
    async getAll({ filters = {}, skip = 0, limit = 10, sort = {} }) {
        const [data, total] = await Promise.all([
            eventModel.find(filters).sort(sort).skip(skip).limit(limit),
            eventModel.countDocuments(filters),
        ]);
        return { data, total };
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
