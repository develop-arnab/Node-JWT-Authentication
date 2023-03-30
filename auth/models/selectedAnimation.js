const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const selectedAnimation = new Schema({
    fileName: {
        type: String,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model('SelectedAnimation', selectedAnimation);