const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addressschema = new Schema({
    country: String,
    provice: String,
    city: String,
    street: String,
});

module.exports =  mongoose.model('address', addressschema);