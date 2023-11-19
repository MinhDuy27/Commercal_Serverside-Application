const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productschema= mongoose.Schema({
    uploadeduserid:{ type: String, required: true },
    name: String,
    price : Number,
    quantity: Number,
    type:{ type: String, default:'upload-requested' },
    status: String,
    reasonforsale: String,
    specification:{
        detail: Schema.Types.Mixed
    },
    image: String,
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