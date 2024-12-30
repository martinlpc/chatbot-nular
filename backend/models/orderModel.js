import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
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

const Order = model('Order', orderSchema);

export default Order;
