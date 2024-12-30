import Order from "../models/orderModel.js"

const queries = {
    horario: 'Nuestro horario de atención es de martes a domingo de 11:00 a 23:00 horas',
    ubicacion: 'Nos encontramos en la calle Falsa 123',
    direccion: 'Nos encontramos en la calle Falsa 123',
    domicilio: 'Nos encontramos en la calle Falsa 123',
    menu: 'A continuación te muestro nuestro menú: ...',
}

export const handleUserMessage = async (message) => {
    const lowerMessage = message.toLowerCase()

    console.log(`[handler] ${lowerMessage}`)

    // Buscar coincidencia en las claves de las queries
    const foundQuery = Object.keys(queries).find(query => lowerMessage.includes(query))
    if (foundQuery) {
        console.log(`[query] ${foundQuery}`)
        if (foundQuery === 'menu') {
            // Aquí se podría hacer una consulta a la base de datos
            const menu = ['Hamburguesa', 'Pizza', 'Ensalada', 'Papas fritas'] // Test
            return `${queries[foundQuery]}\n\n${menu.map((item, index) => `${index + 1}. ${item}`).join('\n')}`
        }

        // No pidieron menú, devolver respuesta predefinida
        return queries[foundQuery]
    }

    // Detectar si se está pidiendo una orden
    const orderMatch = lowerMessage.match(/(?:ordenar|quiero|pedir)\s*(\d+)\s*(.*)/i)
    console.log('orderMatch: ', orderMatch)
    if (orderMatch) {
        const [, quantity, product] = orderMatch

        const newOrder = new Order({
            product,
            quantity,
            timestamp: new Date()
        })
        await newOrder.save()

        return `Perfecto! Agregamos ${quantity} ${product} a tu pedido`
    }

    // Respuesta por defecto si no se detectaron coincidencias
    return "Lo siento, no entendí tu mensaje"
}