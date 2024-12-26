import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
    user: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = model('Message', MessageSchema);
export default Message;