import orderModel from "../models/orderModel.js";

export const findAllOrders = async () => {
    try {
        return await orderModel.find()
    } catch (error) {
        throw new Error(error)
    }
}

export const findOrderByClientName = async (clientName) => {
    try {
        return await orderModel.findBy(clientName)
    } catch (error) {
        throw new Error(error)
    }
}