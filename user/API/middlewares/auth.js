const { validatesignature } = require('../../Database/side-function/side1');

module.exports = async (req,res,next) => {
    
    const isauthorized = await validatesignature(req);
    if(isauthorized){
        return next();
    }
    return res.status(403).json({message: 'not authorized'})
}