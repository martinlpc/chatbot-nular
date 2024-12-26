// frontend/src/components/Chat.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [user, setUser] = useState('');

    useEffect(() => {
        // Solicitar mensajes existentes
        fetch('http://localhost:4000/api/messages')
            .then(res => res.json())
            .then(data => setMessages(data));

        // Escuchar nuevos mensajes
        socket.on('receiveMessage', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => socket.disconnect();
    }, []);

    const sendMessage = () => {
        if (input.trim() && user.trim()) {
            const message = { user, message: input };
            socket.emit('sendMessage', message);
            setInput('');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>Chatbot</h2>
            <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.user}</strong>: {msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                placeholder="Tu nombre"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                style={{ marginBottom: '10px', width: '100%' }}
            />
            <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ marginBottom: '10px', width: '100%' }}
            />
            <button onClick={sendMessage} style={{ width: '100%' }}>Enviar</button>
        </div>
    );
};

export default Chat;
