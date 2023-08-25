import mongoose from 'mongoose';
import { PLANET_NAMES } from '../dataForValidation/constants.js';

const customerSchema = mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    planet: { type: String, required: true, enum: PLANET_NAMES },
    coord: {
        lat: { type: Number, required: true, min: -1000, max: 1000 },
        lon: { type: Number, required: true, min: -1000, max: 1000 }
    },
    phone: { required: true, type: String },
    birthday: { required: true, type: Date },
    referalCode: { type: String, required: true }

}, {
    collection: 'Customers',
    strict: 'throw'

});
customerSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'customer',
    justOne: false
})

export default mongoose.model('Customer', customerSchema);