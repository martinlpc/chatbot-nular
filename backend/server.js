import express from 'express';
import { createServer } from 'http';
import { connect } from 'mongoose';
import { Server } from 'socket.io';
import { PORT } from './config.js';
import cors from 'cors';
import Message from './models/messageModel.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import { handleUserMessage } from './controllers/chatbotController.js';

// Configuración básica
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    },
    connectionStateRecovery: {
        timeout: 30000
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/chatbot', chatbotRoutes);

// Inicializar DB
const initializeDB = async () => {
    const messageCount = await Message.countDocuments();
    if (messageCount === 0) {
        await Message.insertMany([
            { user: 'Admin', message: 'Chat online', timestamp: new Date() },
        ]);
    }
}

// Conexión a MongoDB
const connectToAtlas = async () => {
    await connect(process.env.MONGO_URL)
        .then(() => {
            console.log('MongoDB conectado')
            initializeDB();
        })
        .catch(err => console.error(err))
}

connectToAtlas()

// API de mensajes
app.get('/api/messages', async (req, res) => {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
});

// Comunicación con Socket.io
const onConnection = (socket) => {
    console.log(`Usuario conectado (${socket.id})`);

    socket.on('sendMessage', async (data) => {
        console.log(`[new msg][${socket.id}] ${data.user}: ${data.message}`);

        try {
            const newMessage = new Message(data);
            await newMessage.save();

            //Impresión en el chat del mensaje del usuario
            socket.emit('receiveMessage', data);

            // Logica de respuesta de bot
            const response = await handleUserMessage(data.message);
            console.log(`[bot response] ${response}`);
            // Respuesta del bot
            socket.emit('receiveMessage', { user: 'bot', message: response })

        } catch (error) {
            console.log('Error al procesar mensaje', error);
        }
    })

    socket.on('disconnect', (reason) => {
        console.log(`Usuario '${socket.id}' desconectado (${reason})`);
    });
}

io.on('connection', onConnection);

// Iniciar servidor
server.listen(PORT, () => console.log(`Servidor ejecutándose en http://localhost:${PORT}`));