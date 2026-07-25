import eventsService from '../services/events.service.js';

export async function getAll(req, res, next) {
    try {
        const events = await eventsService.getAllEvents();
        res.status(200).json({ status: 'success', payload: events });
    } catch (error) {
        next(error);
    }
}

export async function createEvent(req, res, next) {
    try {
        const newEvent = await eventsService.createEvent(req.body, req.user.id);
        res.status(201).json({ status: 'success', payload: newEvent });
    } catch (error) {
        next(error);
    }
}

export async function updateEvent(req, res, next) {
    try {
        const updatedEvent = await eventsService.updateEvent(req.params.id, req.body, req.user);
        res.status(200).json({ status: 'success', payload: updatedEvent });
    } catch (error) {
        next(error);
    }
}
