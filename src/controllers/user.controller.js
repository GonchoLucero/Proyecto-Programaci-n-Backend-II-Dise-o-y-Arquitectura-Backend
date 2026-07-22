import { userModel } from '../models/user.model.js';

export async function getAllUsers(req, res, next) {
    try {
        const users = await userModel.find().select('-password');
        res.status(200).json({ status: 'success', payload: users });
    } catch (error) {
        next(error);
    }
}
