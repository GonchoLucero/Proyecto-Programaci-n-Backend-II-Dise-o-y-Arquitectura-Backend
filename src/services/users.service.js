import usersRepository from '../repositories/users.repository.js';

class UsersService {
    constructor(repository) {
        this.repository = repository;
    }

    listUsers() {
        return this.repository.findAll();
    }
}

export default new UsersService(usersRepository);
