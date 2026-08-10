import { userModel } from '../models/user.model.js';

class UsersDao {
    async create(userData) {
        return userModel.create(userData);
    }

    async findByEmail(email) {
        return userModel.findOne({ email });
    }

    async findById(id) {
        return userModel.findById(id);
    }

    async findAll() {
        return userModel.find();
    }
}

export default new UsersDao();
