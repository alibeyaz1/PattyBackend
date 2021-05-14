const mongoose = require('mongoose');
const product = require('./product');
const user = require('./user');

const orderSchema = mongoose.Schema(
  {
    seller: { type: String, required: true },
    customer: { type: String, required: true },
    products: { type: [String], required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamp: true }
);

module.exports = mongoose.model('Order', orderSchema);
