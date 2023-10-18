const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.generatesalt = async () => {
    return await bcrypt.genSalt();
  };
  
  module.exports.generatepassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
  };
  
  module.exports.validatepassword = async (
    enteredpassword,
    savedpassword,
    salt
  ) => {
    return (await this.generatepassword(enteredpassword, salt)) === savedpassword;
  };
  
  module.exports.generatesignature = async (payload) => {
    try {
      return await jwt.sign(payload, process.env.JWT_code, { expiresIn: "7d" });
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  
  module.exports.validatesignature = async (req) => {
    try {
      const signature = req.get("Authorization");//get value from header
      console.log(signature);
      const payload = await jwt.verify(signature.split(" ")[1], process.env.JWT_code);
      req.user = payload;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  