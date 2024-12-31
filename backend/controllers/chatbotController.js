import Order from "../models/orderModel.js"

const queries = {
    horario: 'Nuestro horario de atención es de martes a domingo de 11:00 a 23:00 horas',
    ubicacion: 'Nos encontramos en la calle Falsa 123',
    direccion: 'Nos encontramos en la calle Falsa 123',
    domicilio: 'Nos encontramos en la calle Falsa 123',
    menu: 'A continuación te muestro nuestro menú: ...',
    hola: 'Hola! Somos SushiNular! Escribí "menu" para ver nuestra carta',
}

export const handleUserMessage = async (message) => {
    const lowerMessage = message.toLowerCase()

    console.log(`[handler] ${lowerMessage}`)

    // Buscar coincidencia en las claves de las queries
    const foundQuery = Object.keys(queries).find(query => lowerMessage.includes(query))
    if (foundQuery) return queryResponse(foundQuery)


    // Detectar si se está pidiendo una orden
    const orderMatch = lowerMessage.match(/(?:ordenar|quiero|pedir)\s*(\d+)\s*(.*)/i)
    console.log('orderMatch: ', orderMatch)
    if (orderMatch) return orderResponse(orderMatch)


    // Detectar si se está preguntando si están abiertos en este momento
    if (lowerMessage.includes('abierto' || 'abiertos')) return isOpenResponse()


    // Respuesta por defecto si no se detectaron coincidencias
    return "Lo siento, no entendí tu mensaje"
}

function queryResponse(query) {
    console.log(`[query] ${query}`)
    if (query === 'menu') {
        // TODO: Consultar DB con menú real
        const menu = ['Hamburguesa', 'Pizza', 'Ensalada', 'Papas fritas'] // Test
        return `${queries[query]}\n\n${menu.map((item, index) => `${index + 1}. ${item}`).join('\n')}`
    }

    // No pidieron menú, devolver respuesta predefinida
    return queries[query]
}

async function orderResponse(orderMatch) {
    const [, quantity, product] = orderMatch

    const newOrder = new Order({
        product,
        quantity,
        timestamp: new Date()
    })
    await newOrder.save()

    return `Perfecto! Agregamos ${quantity} ${product} a tu pedido`
}

function isOpenResponse() {
    const now = new Date()
    const day = now.getDay()
    const hour = now.getHours()

    if (day >= 2 && day <= 6 && hour >= 11 && hour < 23) {
        return 'Sí, estamos abiertos hasta las 23 horas!'
    } else {
        return `Lo siento, estamos cerrados en este momento. ${queries.horario}`
    }
}