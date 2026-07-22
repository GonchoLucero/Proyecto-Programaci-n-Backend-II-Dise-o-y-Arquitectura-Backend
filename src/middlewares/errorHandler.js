// Middleware centralizado de manejo de errores.
export const errorHandler = (err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({
        status: 'error',
        message: err.message || 'Error interno del servidor',
    });
};

// Middleware para rutas no encontradas
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    });
};
