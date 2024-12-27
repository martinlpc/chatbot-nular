import express, { json } from 'express';
import { createServer } from 'http';
import { connect } from 'mongoose';
import { Server } from 'socket.io';
import cors from 'cors';
import Message from './models/messageModel.js';
import Response from './models/responseModel.js';

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
    console.log(`Usuario conectado (${socket.id})`);

    socket.on('sendMessage', async (data) => {
        console.log(`[msg][${socket.id}] ${data.user}: ${data.message}`);

        try {
            const newMessage = new Message(data);
            await newMessage.save();

            // TODO: Logica de respuesta de bot
            const autoResp = await Response.findOne({ trigger: data.message.toLowerCase() });

            // Envío del mensaje del usuario al chat
            io.emit('receiveMessage', data);

        } catch (error) {
            console.log('Error al procesar mensaje', error);
        }
    });

    socket.on('disconnect', (reason) => {
        console.log(`Usuario '${socket.id}' desconectado (${reason})`);
    });
});

// Iniciar servidor
const PORT = 4000;
server.listen(PORT, () => console.log(`Servidor ejecutándose en http://localhost:${PORT}`));