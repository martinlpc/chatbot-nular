import { findAllOrders, findOrderByClientName } from "../services/orderServices.js";

export const getAllOrders = async (req, res) => {
    try {
        const orders = await findAllOrders()
        return res.status(200).send(orders)
    } catch (error) {
        res.status(500).send({
            message: 'Error al obtener todas las órdenes',
            error: error.message
        })
    }
}

export const getOrderByClientName = async (req, res) => {
    try {
        const order = await findOrderByClientName(req.params.clientname)
        return res.status(200).send(order)
    } catch (error) {
        res.status(500).send({
            message: 'Error al obtener orden por nombre de cliente',
            error: error.message
        })
    }
}