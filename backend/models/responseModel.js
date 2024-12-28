import { Schema, model } from "mongoose";

const ResponseSchema = new Schema({
    trigger: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    }
});

const Response = model('Response', ResponseSchema);
export default Response;