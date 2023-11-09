const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersschema = new Schema({
    email: String,
    password: String,
    name: String,
    salt:String,
    phone: String,
    address:[
        { type: Schema.Types.ObjectId, ref: 'address', require: true }
    ],
    // cart: [
    //     {
    //       product: { type: Schema.Types.ObjectId, require: true},
    //       unit: { type: Number, require: true}
    //     }
    // ],
    // orders: [ 
    //     { type: Schema.Types.ObjectId, require: true }
    // ],
    notification:[
        {
            content: {type: String, require: true},
            date: {type: String, require: true},
            status: {type: String, require: true}
        }
    ]
},
//,{timestamps: false,
{
    toJSON:{
        transform(doc, ret){
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps : false
}
)
module.exports = mongoose.model('users',usersschema);