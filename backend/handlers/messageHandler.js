export default (io, socket) => {
    const sendMessage = async (payload) => {
        console.log(`[msg][${socket.id}] ${payload.user}: ${payload.message}`);

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
    }
}