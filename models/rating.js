const mongoose = require('mongoose');
const user = require('./user');

const ratingSchema = mongoose.Schema({
    customer: { type: ref(user), required: true },
    seller: { type: ref(user), required: true },
    comment: { type: String, required: true },
    point: { type: Number, required: true }
});

module.exports = mongoose.model('Rating', ratingSchema);