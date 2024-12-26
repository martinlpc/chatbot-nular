import express, { json } from 'express';
import { createServer } from 'http';
import { connect } from 'mongoose';
import { Server } from 'socket.io';
import cors from 'cors';
import Message from './models/messageModel.js';

// Configuración básica
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(json());

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
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('sendMessage', async (data) => {
        const newMessage = new Message(data);
        await newMessage.save();
        io.emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// Iniciar servidor
const PORT = 4000;
server.listen(PORT, () => console.log(`Servidor ejecutándose en http://localhost:${PORT}`));