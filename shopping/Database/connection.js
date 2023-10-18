const mongoose = require('mongoose');

module.exports = async()=>{
    try{
        mongoose.connect('mongodb+srv://nestkyo82:' + process.env.MONGODB_PassWord+'@micro-shopping.ddgxhtr.mongodb.net/')
    }
    catch(error){
        next(error)
    }
}