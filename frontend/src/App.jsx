import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import './App.css'

const SOCKET_SERVER_URL = 'http://localhost:4000';

function App() {
  const [user, setUser] = useState(''); // Nombre del usuario
  const [input, setInput] = useState(''); // Mensaje del usuario
  const [chatLog, setChatLog] = useState([]); // Historial de chat
  const [socket, setSocket] = useState(null); // Instancia del socket

  async function fetchMessages() {
    try {
      const response = await fetch(`${SOCKET_SERVER_URL}/api/messages`);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      console.log(data)
      setChatLog(data);
    } catch (error) {
      setChatLog([{ from: 'bot', text: `Error al cargar mensajes (${error.message})` }]);
    }
  }

  useEffect(() => {
    // Configuración inicial de Socket.IO
    const socketInstance = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    })
    setSocket(socketInstance);

    // Solicitar mensajes existentes
    fetchMessages();

    // Escuchar respuestas del server
    socketInstance.on('receiveMessage', (data) => {
      setChatLog((prev) => [...prev, { user: data.user, message: data.message }]);
    });

    // Limpiar conexión al desmontar
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Enviar mensaje al servidor
  const sendMessage = () => {
    if (!input.trim() && !user.trim()) {
      alert('Por favor, ingrese su nombre y mensaje');
      return; // Evitar mensajes vacíos
    }
    const message = { user, message: input };

    // Enviar mensaje al backend
    if (socket) {
      socket.emit('sendMessage', message);
    } else {
      console.error('Socket no conectado');
    }

    // Actualizar el historial del chat localmente
    //setChatLog((prev) => [...prev, { from: user, text: input }]);
    //setInput(''); // Limpiar el campo de entrada
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '2rem' }}>
      <h1>Sushi Chatbot</h1>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '1rem',
          marginBottom: '1rem',
          height: '300px',
          overflowY: 'scroll',
        }}
      >
        {chatLog.map((entry, index) => (
          <p key={index} style={{ color: entry.user === 'bot' ? 'yellow' : 'green' }}>
            <strong>{entry.user}:</strong> {entry.message}
          </p>
        ))}
      </div>
      <textarea
        value={user}
        onChange={(e) => setUser(e.target.value)}
        placeholder="Tu nombre"
        style={{ width: '100%', marginBottom: '1rem' }}
      />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe tu mensaje aquí..."
        style={{ width: '100%', marginBottom: '1rem' }}
      />
      <button onClick={sendMessage} style={{ padding: '0.5rem 1rem' }}>
        Enviar
      </button>
    </div>
  );
}


export default App
