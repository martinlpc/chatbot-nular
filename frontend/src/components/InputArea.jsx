import React, { useState, Fragment } from "react";

export const InputArea = ({ onSend }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) {
            alert('Por favor, ingresá tu mensaje');
            return;
        }

        onSend(input)
        setInput('')
    }

    return (
        <Fragment>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                style={{ width: '100%', marginBottom: '1rem' }}
            />
            <button onClick={handleSend} style={{ padding: '0.5rem 1rem' }}>
                Enviar
            </button>
        </Fragment>
    )
}