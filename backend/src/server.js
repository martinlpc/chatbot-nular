import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectToAtlas, PORT } from './config.js';
import router from './routes/index.routes.js';
import { handleUserMessage } from './controllers/chatbotController.js';
import errorHandler from './middleware/errorHandler.js';

// Configuración básica
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    },
    connectionStateRecovery: {
        timeout: 30 * 1000
    }
});

// Almacenamiento de sesiones de usuario temporales (con sus órdenes/pedidos)
export const userSessions = {}

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/', router);
app.use(errorHandler)

connectToAtlas()

// Comunicación con Socket.io
const onConnection = (socket) => {
    console.log(`Usuario conectado (${socket.id})`);

    socket.on('msg-user', async (data) => {
        console.log(`[new msg][${socket.id}] ${data.message}`);

        try {
            //Impresión en el chat del mensaje del usuario
            socket.emit('msg-user', { user: 'Yo', message: data.message });

            // Logica de respuesta de bot
            const response = await handleUserMessage(data, socket.id);
            console.log(`[bot response] ${response}`);
            // Respuesta del bot
            socket.emit('msg-bot', { user: 'nular', message: response })

        } catch (error) {
            console.log('Error al procesar mensaje', error);
        }
    })

    socket.on('connect', () => {
        try {
            socket.emit('connection-success', `${socket.id}`);
        } catch (error) {
            console.error('Error al intentar conexión desde el cliente', error);
        }
    })

    socket.on('disconnect', (reason) => {
        console.log(`Usuario '${socket.id}' desconectado (${reason})`);
        delete userSessions[socket.id];
    });

    socket.on('error', (err) => {
        console.error(`[Socket Error] ${err.message}`)
    })
}

io.on('connection', onConnection);

// Iniciar servidor
server.listen(PORT, () => console.log(`Servidor ejecutándose en http://localhost:${PORT}`));