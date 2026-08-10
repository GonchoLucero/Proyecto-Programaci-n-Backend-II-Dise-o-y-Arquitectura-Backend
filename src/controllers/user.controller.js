import usersService from '../services/users.service.js';
import { userListDTO } from '../dto/user.dto.js';

export async function getAllUsers(req, res, next) {
    try {
        const users = await usersService.listUsers();
        res.status(200).json({ status: 'success', payload: userListDTO(users) });
    } catch (error) {
        next(error);
    }
}
