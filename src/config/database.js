import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.connection.on('error', (error) => {
    console.error('Error de conexión a MongoDB:', error.message);
});

export async function conectDB() {
    try {
        await mongoose.connect(env.MONGO_URL);
        console.log('MongoDB conectado correctamente');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
}
