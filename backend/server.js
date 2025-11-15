// server.js - Servidor Express para SERIE III
import express from 'express';
import cors from 'cors';
import { getMessages, connectDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // En producción, especificar el origen exacto
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Ruta principal - Health check
app.get('/', (req, res) => {
    res.json({
        message: 'Backend Chat UMG - SERIE III',
        status: 'running',
        endpoints: {
            messages: '/api/mensajes',
            health: '/health'
        }
    });
});

// Health check
app.get('/health', async (req, res) => {
    try {
        await connectDB();
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message
        });
    }
});

// SERIE III: Endpoint para obtener mensajes de la base de datos
app.get('/api/mensajes', async (req, res) => {
    try {
        const sortOrder = req.query.sort || 'DESC';

        console.log(`Obteniendo mensajes con orden: ${sortOrder}`);
        const messages = await getMessages(sortOrder);

        res.json(messages);
    } catch (error) {
        console.error('Error en /api/mensajes:', error);
        res.status(500).json({
            error: 'Error al obtener mensajes de la base de datos',
            details: error.message
        });
    }
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        availableRoutes: ['/', '/health', '/api/mensajes']
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        details: err.message
    });
});

// Iniciar servidor
app.listen(PORT, async () => {
    console.log('\n' + '='.repeat(60));
    console.log(`Servidor backend iniciado en puerto ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log('='.repeat(60));
    console.log('\nEndpoints disponibles:');
    console.log(`  - GET  http://localhost:${PORT}/`);
    console.log(`  - GET  http://localhost:${PORT}/health`);
    console.log(`  - GET  http://localhost:${PORT}/api/mensajes`);
    console.log('='.repeat(60) + '\n');

    // Verificar conexión a la base de datos al iniciar
    try {
        await connectDB();
        console.log('Verificación de conexión: OK\n');
    } catch (error) {
        console.error('Error al verificar conexión a la base de datos:', error.message);
        console.error('El servidor continuará ejecutándose, pero las consultas a la BD fallarán.\n');
    }
});

export default app;
