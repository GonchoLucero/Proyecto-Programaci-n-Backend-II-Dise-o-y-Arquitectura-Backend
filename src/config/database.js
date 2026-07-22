import mongoose from 'mongoose';
import { env } from './env.js';

export async function conectDB() {
    await mongoose.connect(env.MONGO_URL);
    console.log('MongoDB conectado correctamente');
}
