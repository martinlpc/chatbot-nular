import orderModel from "../models/orderModel.js";
import CustomError from "../utils/CustomError.js";

export const findAllOrders = async () => {
    try {
        const orders = await orderModel.find()
        if (!orders.length) {
            throw new CustomError('No se encontraron ordenes', 404)
        }
    } catch (error) {
        throw new CustomError(error.message || 'Error en base de datos', 500)
    }
}

export const findOrderByClientName = async (clientName) => {
    try {
        const order = await orderModel.findBy(clientName)
        if (!order) {
            throw new CustomError(`No se enncontró orden del cliente '${clientName}'`, 404)
        }
    } catch (error) {
        throw new CustomError(error.message || 'Error en base de datos', 500)
    }
}

export const insertOrder = async (orderData) => {
    try {
        const newOrder = new orderModel(orderData)
        return await newOrder.save()
    } catch (error) {
        throw new CustomError(error.message || 'Error en base de datos', 500)
    }

}