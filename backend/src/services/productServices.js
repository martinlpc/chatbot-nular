import productModel from "../models/productModel.js"

export const findAllProducts = async () => {
    try {
        return await productModel.find()
    } catch (error) {
        throw new Error(error)
    }
}

export const findProductById = async (id) => {
    try {
        return await productModel.findBy(id)
    } catch (error) {
        throw new Error(error)
    }
}

export const insertNewProducts = async (product) => {
    try {
        // Puede ser uno solo o un conjunto de productos en array
        return await productModel.insertMany(product)
    } catch (error) {
        throw new Error(error)
    }
}

export const updateProduct = async (code, info) => {
    try {
        return await productModel.findOneAndUpdate(code, info)
    } catch (error) {
        throw new Error(error);

    }
}