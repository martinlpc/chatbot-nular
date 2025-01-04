import { Router } from 'express';
import routerOrders from './orders.routes.js';
import routerProducts from './products.routes.js';

const router = Router();

router.use('/api/products', routerProducts)
router.use('/api/orders', routerOrders)

export default router