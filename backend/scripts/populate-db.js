import mongoose from "mongoose";
import productModel from "../src/models/productModel.js";
import fs from 'fs'
import path from 'path'

const MONGO_URI = process.env.MONGO_URI

await mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Conexión exitosa a la base de datos cloud')

        const dataPath = path.join(process.cwd(), 'scripts/initialdata.json')
        const rawData = fs.readFileSync(dataPath)
        const data = JSON.parse(rawData)

        await productModel.insertMany(data)
        console.log('Datos cargados con éxito');

    })
    .catch(error => {
        console.error('Error al conectarse o importar datos: ', error);
    })
    .finally(() => {
        mongoose.connection.close()
    })