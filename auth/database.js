'use strict';
const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(
         'mongodb+srv://create:3.14ToInfinity@createapp.fhl1vbl.mongodb.net/?retryWrites=true&w=majority'
        //'mongodb://localhost:27017/upload-files-database'
        , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true,
    }).then(() => console.log('Connected to Mongodb......'));
}