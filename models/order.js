const mongoose = require('mongoose');
const product = require('./product');
const user = require('./user');

const orderSchema = mongoose.Schema({
    date: { type: Date, required: true },
    customer: { type: String, required: true },
    products: { type: [String], required: true },
    totalPrice: { type: Number, required: true }
});

module.exports = mongoose.model('Order', orderSchema);