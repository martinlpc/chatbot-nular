import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import './App.css'
import { ChatLog } from './components/ChatLog';
import { InputArea } from './components/InputArea';

const SOCKET_SERVER_URL = 'http://localhost:4000';

function App() {
  const [chatLog, setChatLog] = useState([]); // Historial de chat
  const [socket, setSocket] = useState(null); // Instancia del socket

  useEffect(() => {
    // Configuración inicial de Socket.IO
    const socketInstance = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    })
    setSocket(socketInstance);

    socketInstance.on('connection-success', (data) => {
      console.log(`Conectado al servidor con ID: ${data}`);
    });

    //  Manejo de error de conexion
    socketInstance.on('connect_error', (err) => {
      console.error('Error de conexión:', err);
    });


    // * RESPUESTAS DEL SERVER *

    // Retorno del mensaje del usuario
    socketInstance.on('msg-user', (data) => {
      setChatLog((prev) => [...prev, { user: data.user, message: data.message }]);
    });

    // Respuesta del bot al mensaje del usuario
    socketInstance.on('msg-bot', (data) => {
      setChatLog((prev) => [...prev, { user: data.user, message: data.message }]);
    });


    // Limpiar conexión al desmontar
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Enviar mensaje al servidor
  const sendMessage = (data) => {
    const message = { user: 'user', message: data };

    // Enviar mensaje al backend
    if (socket) {
      socket.emit('msg-user', message);
    } else {
      console.error('Socket no conectado');
      alert('No se pudo enviar el mensaje. Intente nuevamente en breve');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '2rem' }}>
      <h1>Sushi Chatbot</h1>
      <ChatLog chatLog={chatLog} />
      <InputArea onSend={sendMessage} />
    </div>
  );
}


export default App
