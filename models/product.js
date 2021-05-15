const mongoose = require('mongoose');
const user = require('./user');

const productSchema = mongoose.Schema({
  seller: { type: String, required: true },
  sellerName: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  isWeight: { type: Boolean, required: true },
  imagePath: { type: String, required: true },
  sold: { type: Number },
});

module.exports = mongoose.model('Product', productSchema);
