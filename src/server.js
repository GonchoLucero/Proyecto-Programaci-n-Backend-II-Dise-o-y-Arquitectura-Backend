import app from './app.js';
import { env } from './config/env.js';
import { conectDB } from './config/database.js';

const startServer = async () => {
    await conectDB();

    app.listen(env.PORT, () => {
        console.log(`Servidor escuchando en el puerto ${env.PORT}`);
        console.log(`Entorno: ${env.NODE_ENV}`);
    });
};

startServer();
