const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const canvasStateSchema = new Schema({
    version: {
        type: String,
        required: true
    },
    objects: [Object]
}, {timestamps: true});

module.exports = mongoose.model('CanvasState', canvasStateSchema);