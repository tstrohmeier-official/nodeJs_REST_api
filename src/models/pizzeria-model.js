import mongoose from 'mongoose';
import { PLANET_NAMES } from '../dataForValidation/constants.js';

const pizzeriaSchema = mongoose.Schema({

    planet: { type: String, required: true, enum: PLANET_NAMES },
    coord: {
        lat: { type: Number, required: true, min: -1000, max: 1000 },
        lon: { type: Number, required: true, min: -1000, max: 1000 }
    },
    chef: {
        name: { type: String, required: true },
        ancestor: { type: String, required: true },
        speciality: { type: String, required: true }
    }

}, {
    collection: 'Pizzerias',
    strict: 'throw',
    id: false
});
pizzeriaSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'pizzeria',
    justOne: false
});

export default mongoose.model('Pizzeria', pizzeriaSchema);