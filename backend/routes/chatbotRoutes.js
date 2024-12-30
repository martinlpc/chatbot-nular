import express from 'express';
import Order from '../models/orderModel.js';

const router = express.Router();

router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
})

export default router