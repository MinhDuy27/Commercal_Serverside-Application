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