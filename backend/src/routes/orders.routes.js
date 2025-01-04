import { Router } from "express";
import { getAllOrders, getOrderByClientName } from "../controllers/orderController.js";

const routerOrders = Router()

routerOrders.route('/')
    .get(getAllOrders)

routerOrders.route('/:clientname')
    .get(getOrderByClientName)

export default routerOrders