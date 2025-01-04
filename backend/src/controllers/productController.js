import { findProductById, findAllProducts, insertNewProducts, updateProduct } from "../services/productServices.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await findAllProducts()
        return res.status(200).send(products)
    } catch (error) {
        res.status(500).send({
            message: 'Error al obtener todos los productos',
            error: error.message
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await findProductById(req.params.id)
        return res.status(200).send(product)
    } catch (error) {
        res.status(500).send({
            message: 'Error al obtener el producto especificado',
            error: error.message
        })
    }
}

export const addProducts = async (req, res) => {
    try {
        const products = await insertNewProducts(req.body)
        res.status(200).send({
            message: 'Producto/s añadido/s con éxito',
            payload: products
        })
    } catch (error) {
        res.status(500).send({
            message: 'Error al añadir producto/s',
            error: error.message
        })
    }
}

export const modifyProduct = async (req, res) => {
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
        res.status(500).send({
            message: 'Error al modificar el producto especificado',
            error: error.message
        })
    }
}