const mongoose = require('mongoose');

const exampleSchema = mongoose.Schema({
    example: { type: String, required: true },
});

module.exports = mongoose.model('Example', exampleSchema);