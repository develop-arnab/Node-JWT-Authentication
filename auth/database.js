'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(
        process.env.MONGO_CONNECT
        //'mongodb://localhost:27017/upload-files-database'
        , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true,
    }).then(() => console.log('Connected to Mongodb......'));
}