const mongoose = require('mongoose');
const product = require('./product');
const user = require('./user');

const orderSchema = mongoose.Schema({
    orderno: { type: Number, required: true },
    date: { type: Date, required: true },
    customer: { type: ref(user), required: true },
    products: { type: [ref(product)], required: true },
    totalPrice: { type: Number, required: true }
});

module.exports = mongoose.model('Order', orderSchema);