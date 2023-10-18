const mongoose = require('mongoose');

module.exports = async()=>{
    try{
        mongoose.connect('mongodb+srv://nestkyo82:' + process.env.MONGODB_PassWord+'@micro-product.gbl0n6w.mongodb.net/')
    }
    catch(error){
        next(error)
    }
}