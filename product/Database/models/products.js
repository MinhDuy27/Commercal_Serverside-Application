const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productschema= mongoose.Schema({
    uploaduserid:{ type: String, required: true },
    name: String,
    price : Number,
    quantity: Number,
    type:String,
    specification:String,
    status: { type: String, default:'upload-requested'},
    reasonforsale: String,
    image: String
}
,{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;      
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
})
module.exports = mongoose.model('products',productschema);