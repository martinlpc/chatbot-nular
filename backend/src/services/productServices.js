import productModel from "../models/productModel.js"
import CustomError from "../utils/CustomError.js"

export const findAllProducts = async () => {
    try {
        const products = await productModel.find()
        if (!products.length) {
            throw new CustomError('No se encontraron productos', 404)
        }
        return products
    } catch (error) {
        throw new CustomError(error.message || 'Error en base de datos', 500)
    }
}

export const findProductById = async (id) => {
    try {
        const product = await productModel.findBy(id)
        if (!product) {
            throw new CustomError(`No se encontró el producto con id '${id}'`, 404)
        }
        return product
    } catch (error) {
        throw new CustomError(error.message || 'Error en base de datos', 500)
    }
}

export const insertNewProducts = async (product) => {
    try {
        // Puede ser uno solo o un conjunto de productos en array
        return await productModel.insertMany(product)
    } catch (error) {
        throw new CustomError(error.message || 'Error en base de datos', 500)
    }
}

export const updateProduct = async (code, info) => {
    try {
        const product = await productModel.findOneAndUpdate(code, info)
        if (!product) {
            throw new CustomError(`No se enncontró el producto con codigo '${code}'`, 404)
        }
    } catch (error) {
        throw new CustomError(error.message || 'Error en base de datos', 500)

    }
}