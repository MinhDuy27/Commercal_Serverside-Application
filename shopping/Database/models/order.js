const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderschema = new Schema({
    usersid: mongoose.Schema.Types.ObjectId,//unique
    orderid: String,//unique
    orderdate:String,
    status: String,
    amount: Number,
    deliveryway: String,
    items: [
        {   
            product: {type: Schema.Types.ObjectId, required: true} ,
            unit: { type: Number, require: true} 
        }
    ]
}
);

module.exports =  mongoose.model('order', orderschema);