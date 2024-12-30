const queries = {
    horario: 'Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00 horas',
    direccion: 'Nos encontramos en la calle Falsa 123',
    menu: 'A continuación te muestro nuestro menú: ...',
}

export const handleUserMessage = async (message) => {
    // Analizar mensaje para extraer que está solicitando
    const query = message.match(/(?:horario|atencion)/i)

    // Buscar respuesta en base de datos
    const response = queries[query]
}