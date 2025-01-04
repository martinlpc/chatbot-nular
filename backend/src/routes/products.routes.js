import { Router } from "express";
import { getAllProducts, getProductById, addProducts, modifyProduct } from "../controllers/productController.js";

const routerProducts = Router()

routerProducts.route('/')
    .get(getAllProducts)
    .post(addProducts)

routerProducts.route('/:code')
    .get(getProductById)
    .put(modifyProduct)


export default routerProducts