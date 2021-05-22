const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    seller: { type: String, required: true },
    sellerName: { type: String, required: true },
    date: { type: Date, required: true },
    customer: { type: String, required: true },
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    products: { type: [String], required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamp: true }
);

module.exports = mongoose.model('Order', orderSchema);
