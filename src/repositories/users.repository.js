import usersDao from "../dao/users.dao.js";

class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    create(userData) {
        return this.dao.create(userData);
    }

    findByEmail(email) {
        return this.dao.findByEmail(email);
    }

    findById(id) {
        return this.dao.findById(id);
    }
}

export default new UsersRepository(usersDao);
