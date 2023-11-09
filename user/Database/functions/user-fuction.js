const  usersmodel  = require("../models/users");
const  addressmodel  = require("../models/address");

class usersrepository {
  async createusers( {email,password,name,salt,phone }) {
      console.log(password)
      const users = new usersmodel({
        email,
        password,
        name,
        salt,
        phone,
        address: [],
      });
      return await users.save();
    
  }
  async createaddress({ _id,ProvinceOrCity,District,CommuneOrWard,HouseNumber }) {
      const profile = await usersmodel.findById(_id);
      const newAddress = new addressmodel({
        ProvinceOrCity,
        District,
        CommuneOrWard,
        HouseNumber,
      });
      await newAddress.save();
      profile.address.push(newAddress);
      return await profile.save();
  }
  async changepassword({email,userpassword}){
        const query = { email: email };
        const update = { $set: { password: userpassword }};
        const options = {};
        return await usersmodel.updateOne(query, update, options)
  }
  async postnotify({email,infor}){
      const existingusers = await usersmodel.findOne({ email: email });
      let notidate = new Date().toLocaleString();
      const newNotification = {
        infor: infor,
        date: notidate
      };
      existingusers.notification.push(newNotification);
      return existingusers.save();
  }
  async findusers( email ) {
      return await usersmodel.findOne({ email: email }); 
  }

  async findusersbyid({ _id }) {
      return await usersmodel.findById(_id);
  }
};
module.exports = usersrepository;