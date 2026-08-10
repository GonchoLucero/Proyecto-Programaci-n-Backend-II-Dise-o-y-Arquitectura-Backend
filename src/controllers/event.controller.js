import eventsService from '../services/events.service.js';
import { eventDTO, eventListDTO } from '../dto/event.dto.js';

export async function getAll(req, res, next) {
    try {
        const { data, ...pagination } = await eventsService.listEvents(req.query);
        res.status(200).json({ status: 'success', data: eventListDTO(data), ...pagination });
    } catch (error) {
        next(error);
    }
}

export async function getById(req, res, next) {
    try {
        const event = await eventsService.getEventById(req.params.id);
        res.status(200).json({ status: 'success', payload: eventDTO(event) });
    } catch (error) {
        next(error);
    }
}

export async function createEvent(req, res, next) {
    try {
        const newEvent = await eventsService.createEvent(req.body, req.user.id);
        res.status(201).json({ status: 'success', payload: eventDTO(newEvent) });
    } catch (error) {
        next(error);
    }
}

export async function updateEvent(req, res, next) {
    try {
        const updatedEvent = await eventsService.updateEvent(req.params.id, req.body, req.user);
        res.status(200).json({ status: 'success', payload: eventDTO(updatedEvent) });
    } catch (error) {
        next(error);
    }
}

export async function updateEventStatus(req, res, next) {
    try {
        const updatedEvent = await eventsService.updateEventStatus(
            req.params.id,
            req.body.status,
            req.user
        );
        res.status(200).json({ status: 'success', payload: eventDTO(updatedEvent) });
    } catch (error) {
        next(error);
    }
}
