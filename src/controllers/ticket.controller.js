import { ticketModel } from '../models/ticket.model.js';

export async function getAllTickets(req, res, next) {
    try {
        const tickets = await ticketModel.find();
        res.status(200).json({ status: 'success', payload: tickets });
    } catch (error) {
        next(error);
    }
}
