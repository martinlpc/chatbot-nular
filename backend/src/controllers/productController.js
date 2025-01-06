import { findProductById, findAllProducts, insertNewProducts, updateProduct } from "../services/productServices.js";

export const getAllProducts = async (req, res, next) => {
    try {
        const products = await findAllProducts()
        return res.status(200).send(products)
    } catch (error) {
        next(error)
    }
}

export const getProductById = async (req, res, next) => {
    try {
        const product = await findProductById(req.params.id)
        return res.status(200).send(product)
    } catch (error) {
        next(error)
    }
}

export const addProducts = async (req, res, next) => {
    try {
        const products = await insertNewProducts(req.body)
        res.status(200).send({
            message: 'Producto/s añadido/s con éxito',
            payload: products
        })
    } catch (error) {
        next(error)
    }
}

export const modifyProduct = async (req, res, next) => {
    const productCode = req.params.code
    const productData = req.body

    try {
        const product = await updateProduct(productCode, productData)
        if (product) {
            return res.status(200).send({
                message: `Producto [${code}] actualizado`,
                payload: product
            })
        }
        return res.status(404).send('No se encontró el código de producto especificado')
    } catch (error) {
        next(error)
    }
}