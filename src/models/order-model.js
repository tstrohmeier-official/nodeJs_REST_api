import mongoose from 'mongoose';
import { PIZZA_SIZES } from '../dataForValidation/constants.js';
import { PIZZA_TOPPINGS } from '../dataForValidation/constants.js';

const orderSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    pizzeria: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Pizzeria'
    },
    orderDate: { type: Date, required: true },
    pizzas: [
        {
            topping: [String],
            size: { type: String, required: true, enum: PIZZA_SIZES },
            price: { type: Number, required: true, enum: PIZZA_TOPPINGS }
        }
    ]
}, {
    collection: 'Orders',
    strict: 'throw'
});

export default mongoose.model('Order', orderSchema);