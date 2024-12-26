import express, { json } from 'express';
import { createServer } from 'http';
import { connect, Schema, model } from 'mongoose';
import socketIo from 'socket.io';
import cors from 'cors';

// Configuración básica
const app = express();
const server = createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(json());

// Conexión a MongoDB
connect('mongodb://localhost:27017/chatbot', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error(err));

// Modelo de Mensaje
const MessageSchema = new Schema({
    user: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});
const Message = model('Message', MessageSchema);

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
