import { connect } from 'mongoose';

export const PORT = process.env.PORT || 4000

// Conexión a MongoDB
export const connectToAtlas = async () => {
    await connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to Atlas cloud database')
        })
        .catch(err => console.error(err))
}
