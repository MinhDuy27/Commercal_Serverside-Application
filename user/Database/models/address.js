const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addressschema = new Schema({
    ProvinceOrCity: String,
    District: String,
    CommuneOrWard: String,
    HouseNumber: String
});

module.exports =  mongoose.model('address', addressschema);