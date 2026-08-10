import mongoose from 'mongoose';
import { ticketModel } from '../models/ticket.model.js';

class TicketsDao {
    async create(ticketData) {
        return ticketModel.create(ticketData);
    }

    async findById(id) {
        return ticketModel.findById(id);
    }

    async findActiveByUserAndEvent(userId, eventId) {
        return ticketModel.findOne({
            user: userId,
            event: eventId,
            status: { $ne: 'cancelled' },
        });
    }

    async countActiveQuantityByEvent(eventId) {
        const result = await ticketModel.aggregate([
            {
                $match: {
                    event: new mongoose.Types.ObjectId(eventId),
                    status: { $ne: 'cancelled' },
                },
            },
            { $group: { _id: null, total: { $sum: '$quantity' } } },
        ]);
        return result[0]?.total || 0;
    }

    async findByUser(userId) {
        return ticketModel.find({ user: userId }).populate('event', 'title date location');
    }

    async findByEvent(eventId) {
        return ticketModel.find({ event: eventId }).populate('user', 'first_name last_name email');
    }

    async update(id, updates) {
        return ticketModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    }
}

export default new TicketsDao();
