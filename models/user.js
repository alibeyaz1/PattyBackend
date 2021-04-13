const mongoose = require('mongoose');
const product = require('./product');

const userSchema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    isSeller: { type: Boolean, required: true },
    address: { type: String},
    minOrderPrice: { type: Number },
    favorites: { type: [String] },
});

module.exports = mongoose.model('User', userSchema);