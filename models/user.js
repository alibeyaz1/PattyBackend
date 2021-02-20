const mongoose = require('mongoose');
const product = require('./product');

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isSeller: { type: Boolean, required: true },
    address: { type: String, required: true },
    minOrderPrice: { type: Number },
    favorites: { type: [ref(product)] },
});

module.exports = mongoose.model('User', userSchema);