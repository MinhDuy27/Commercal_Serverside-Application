const mongoose = require('mongoose');

module.exports = async()=>{
    try{
        mongoose.connect('mongodb+srv://nestkyo82:' + process.env.MONGODB_PassWord + '@micro-product.rapnulf.mongodb.net/?retryWrites=true&w=majority')
    }
    catch(error){
        next(error)
    }
}