import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    product: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const orderModel = model('Order', orderSchema);
export default orderModel;
