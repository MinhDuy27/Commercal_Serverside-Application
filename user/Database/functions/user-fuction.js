const  usersmodel  = require("../models/users");
const  addressmodel  = require("../models/address");

class usersrepository {
  async createusers({ email,password,name,salt,phone }) {
    
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
  async createaddress({ _id,country, province, city, street }) {
 
      const profile = await usersmodel.findById(_id);

      if (profile) {
        const newAddress = new addressmodel({
          country,
          province,
          city,
          street,
        });
        await newAddress.save();
        profile.address.push(newAddress);
      }
      // save the address if push in
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

  async findusersbyid({ id }) {
      const existingusers = await usersmodel.findById(id)
        .populate("address")
        .populate("orders")
        .populate("cart.product");
      return existingusers;
  }
  
  async addcartitem(usersid, productid, quantity, isRemove) {
      const profile = await usersmodel.findById(usersid);
        const cartItem = {
          product: productid,
          unit: quantity,
        };

        let cartItems = profile.cart;

        if (cartItems.length > 0) {
          let isExist = false;
          cartItems.map((item) => {
            if (item.product.toString() === productid.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = quantity;
              }
              isExist = true;
            }
          });

          if (!isExist) {
            cartItems.push(cartItem);
          }
        } else {
          cartItems.push(cartItem);
        }

        profile.cart = cartItems;
        const cartSaveResult = await profile.save();
        return cartSaveResult.cart;
  }

//   async addordertoprofile(customerid, order) {
   
//       const profile = await usersmodel.findById(customerid);
//         if (profile.orders == undefined) {
//           profile.orders = [];
//         }
//         profile.orders.push(order);
//         profile.cart = [];
//          return await profile.save();
    
//   }
}

module.exports = usersrepository;