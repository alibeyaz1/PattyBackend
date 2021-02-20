const mongoose = require('mongoose');
const user = require('./user');

const productSchema = mongoose.Schema({
    seller: { type: ref(user), required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    isWeight: { type: Boolean, required: true },
    ingredients: { type: [String], required: true },
    imagePath: { type: String, required: true },
});

module.exports = mongoose.model('Product', productSchema);