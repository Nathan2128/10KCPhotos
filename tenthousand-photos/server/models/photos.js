const mongoose = require('mongoose');

const photosSchema = mongoose.Schema({
    caption: { type: String, required: true },
    photo: { type: String, required: true }
})

module.exports = mongoose.model('Photos', photosSchema);