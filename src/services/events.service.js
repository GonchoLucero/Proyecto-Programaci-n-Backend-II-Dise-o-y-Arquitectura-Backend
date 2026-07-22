import eventsRepository from '../repositories/events.repository.js';

// El Service concentra la lógica de negocio.
// En esta pre-entrega solo delega al repository; en próximas entregas
// se sumará validación, control de cupos e inscripciones.
class EventsService {
    constructor(repository) {
        this.repository = repository;
    }

    getAllEvents() {
        return this.repository.getAll();
    }

    getEventById(id) {
        return this.repository.getById(id);
    }

    createEvent(eventData) {
        return this.repository.create(eventData);
    }
}

export default new EventsService(eventsRepository);
