const mongoose = require('mongoose');
const user = require('./user');

const ratingSchema = mongoose.Schema({
    customer: { type: String, required: true },
    seller: { type: String, required: true },
    comment: { type: String, required: true },
    point: { type: Number, required: true }
});

module.exports = mongoose.model('Rating', ratingSchema);