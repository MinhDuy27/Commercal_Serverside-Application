const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartschema = new Schema({
    userid: String,
    items:[{
        product:Schema.Types.Mixed
        ,
        unit: { type: Number, require: true} 
    }],
}
,{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;    
            delete ret.createdAt;
            delete ret.updatedAt;  
        }
    },
}
);
module.exports =  mongoose.model('cart', cartschema);