import { findAllOrders, findOrderByClientName } from "../services/orderServices.js";
import CustomError from "../utils/CustomError.js";

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await findAllOrders()
        return res.status(200).send({
            success: true,
            orders: orders
        })
    } catch (error) {
        next(error)
    }
}

export const getOrderByClientName = async (req, res, next) => {
    try {
        const { clientname } = req.params
        if (!clientname) {
            throw new CustomError('Nombre de cliente requerido', 400)
        }

        const orders = await findOrderByClientName(clientname)
        return res.status(200).send({
            success: true,
            orders: orders
        })
    } catch (error) {
        next(error)
    }
}