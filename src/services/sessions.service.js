import usersRepository from '../repositories/users.repository.js';
import { createHash, isValidPassword } from '../utils/hash.js';
import { isValidEmail, isValidPasswordLength, MIN_PASSWORD_LENGTH } from '../utils/validators.js';
import { AppError } from '../utils/errors.js';
import { generateToken } from '../utils/jwt.js';

class SessionsService {
    constructor(repository) {
        this.repository = repository;
    }

    async register({ first_name, last_name, email, password }) {
        if (!first_name || !last_name || !email || !password) {
            throw new AppError('Faltan campos obligatorios', 400);
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!isValidEmail(normalizedEmail)) {
            throw new AppError('Formato de email inválido', 400);
        }

        if (!isValidPasswordLength(password)) {
            throw new AppError(
                `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
                400
            );
        }

        const existingUser = await this.repository.findByEmail(normalizedEmail);
        if (existingUser) {
            throw new AppError('El email ya está registrado', 409);
        }

        const hashedPassword = await createHash(password);

        const newUser = await this.repository.create({
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        return {
            id: newUser._id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            role: newUser.role,
        };
    }

    async login({ email, password }) {
        const invalidCredentials = () => new AppError('Credenciales inválidas', 401);

        if (!email || !password) {
            throw invalidCredentials();
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.repository.findByEmail(normalizedEmail);
        if (!user) {
            throw invalidCredentials();
        }

        const passwordMatches = await isValidPassword(password, user.password);
        if (!passwordMatches) {
            throw invalidCredentials();
        }

        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });

        return token;
    }
}

export default new SessionsService(usersRepository);
