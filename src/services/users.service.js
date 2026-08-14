import usersRepository from '../repositories/users.repository.js';

class UsersService {
    constructor(repository) {
        this.repository = repository;
    }

    listUsers() {
        return this.repository.findAll();
    }

    getUserById(id) {
        return this.repository.findById(id);
    }
}

export default new UsersService(usersRepository);
