import { insertOrder } from "../services/orderServices.js"
import { findAllProducts } from "../services/productServices.js"
import { userSessions } from "../server.js"

const queries = {
    horario: 'Nuestro horario de atención es de martes a domingo de 11:00 a 23:00 horas',
    ubicacion: 'Nos encontramos en la calle Falsetti 1357, CABA',
    direccion: 'Nos encontramos en la calle Falsetti 1357, CABA',
    domicilio: 'Nos encontramos en la calle Falsetti 1357, CABA',
    menu: 'A continuación te muestro nuestro menú: ...',
    hola: 'Hola! Somos SushiNular 🍣 Escribí "menu" para ver nuestra carta',
}

export const handleUserMessage = async (data, userID, next) => {
    const lowerMessage = data.message.toLowerCase()

    console.log(`[handler] ${lowerMessage}`)

    // Detectar si se trata de un usuario que realizo pedido y esta ingresando su nombre
    if (userSessions[userID] && userSessions[userID].product) return orderResponse(null, userID, data.message)

    // Detectar si se está pidiendo una orden
    const orderMatch = lowerMessage.match(/(?:ordenar|quiero|pedir)\s*(\d+)\s*(.*)/i)
    console.log('orderMatch: ', orderMatch)
    if (orderMatch) return orderResponse(orderMatch, userID, data.message, next)

    // Buscar coincidencia en las claves de las queries
    const foundQuery = Object.keys(queries).find(query => lowerMessage.includes(query))
    if (foundQuery) return queryResponse(foundQuery)


    // Detectar si se está preguntando si están abiertos en este momento
    if (lowerMessage.includes('abierto' || 'abiertos' || 'atendiendo')) return isOpenResponse()


    // Respuesta por defecto si no se detectaron coincidencias
    return "Lo siento, no entendí tu mensaje"
}

async function queryResponse(query) {
    console.log(`[query] ${query}`)
    if (query === 'menu') {
        try {
            const menuResponse = await findAllProducts()
            return `${queries[query]}\n\n${menuResponse.map((item, index) => `${index + 1}. ${item.name}`).join('\n')}`
        } catch (error) {
            return 'Perdón! Hubo en error con tu último mensaje :( lo vamos a chequear'
        }
    }

    // No pidieron menú, devolver respuesta predefinida
    return queries[query]
}

export async function orderResponse(orderMatch, userID, userMessage, next) {
    // Declara un objeto vacío para el pedido del usuario si la sesión no existe (es pedido)
    if (!userSessions[userID]) userSessions[userID] = {}

    // Obtiene el pedido del usuario para saber si ya está en proceso (falta pedir nombre) o es nuevo
    const userOrder = userSessions[userID]

    if (!userOrder.product) {
        const [, quantity, product] = orderMatch
        const orderData = { quantity: parseInt(quantity), product, timestamp: new Date() }

        saveUserTempOrder(userID, orderData)

        return `Perfecto, agregué ${quantity} ${product} a tu pedido. ¿Cuál es tu nombre?`

    } else if (!userOrder.username) {
        userOrder.username = userMessage.toLowerCase()

        try {
            insertOrder(userOrder)
            const { username, quantity, product } = userOrder
            delete userSessions[userID]

            return `¡Gracias ${username}! Tu pedido de ${quantity} ${product} fue registrado.`
        } catch (error) {
            next(error)
        }

    }
}

function isOpenResponse() {
    const now = new Date()
    const day = now.getDay()
    const hour = now.getHours()

    if (day >= 2 && day <= 6 && hour >= 11 && hour < 23) {
        return 'Sí, hoy estamos abiertos hasta las 23 horas!'
    } else {
        return `Lo siento, estamos cerrados en este momento. ${queries.horario}`
    }
}

function saveUserTempOrder(userID, data) {
    userSessions[userID] = data
}