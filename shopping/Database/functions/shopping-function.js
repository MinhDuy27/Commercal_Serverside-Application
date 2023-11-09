const {RPCRequest} = require("../../RPC/rpc");
const ordermodel = require("../models/order");
const cartmodel = require("../models/cart");
const { v4: uuidv4 } = require('uuid'); //generate uniq id
const { validationError } = require("../side-function/app-error");
const {PublishMessage} = require("../../message-broker/message-broker")
//Dealing with data base operations
class shoppingrepository {
    async getorder(userid) {
       return await ordermodel.find({ "userid": userid })
    }
    async deleteorder(userid, orderid,channel) {
      const query = {
        userid: userid,
        orderid: orderid
      };
        let event = "deleteorder";
        let orderitem = await ordermodel.findOne(query);
        if (orderitem) {
          let items = orderitem.items;
          items.map(item=>{
            const payload = {event:event,productid:item.product._id,qty:item.unit};
            PublishMessage(channel,"PRODUCT-BROKER",JSON.stringify(payload));
          })
          const result = await ordermodel.findOneAndDelete(query);
          return result;
        }
        else {
            throw new validationError("user's order is empty");
        }
    }//
    async createneworder(userid,deliveryaddress,channel) {
        let amount = 0;
        let event = "placeorder";
        let cart = await cartmodel.findOne({userid: userid});
        let cartItems = cart.items;
        cart.items = [];
        cart.save();
        if (cartItems.length>0) {
            cartItems.map(item => {
                amount += parseInt(item.product.price) * parseInt(item.unit);
                const payload = {event:event,productid:item.product._id,qty:item.unit};
                PublishMessage(channel,"PRODUCT-BROKER",JSON.stringify(payload));
            });
            const orderid = uuidv4();
            let orderdate = new Date().toLocaleString();
            const order = new ordermodel({
                orderid,
                orderdate,
                status: 'processing',
                amount,
                deliveryaddress,
                items: cartItems
            })
            order.userid = userid;
            const orderResult = await order.save();
            return orderResult;
        }
        throw new validationError("cart is empty");
    }
    async addcartitem(usersid, productid, qty, isRemove) {
      //
          let cart = await cartmodel.findOne({userid: usersid});
          const payload = {productid};
          const getproduct = await RPCRequest("PRODUCT-RPC",payload);
          const {_id,name,price,quantity,type,status,specification,reasonforsale,productimage} = getproduct;
          const product = { // Product JSON object with all fields
            _id: _id,
            name: name,
            price: price,
            quantity: quantity,
            type: type,
            status: status,
            specification: specification,
            reasonforsale: reasonforsale,
            productimage:productimage
          };
          if (cart) {
            let cartItems = cart.items;
            let isExist = false;
            cartItems.map((item) => {
              if ((item.product)._id.toString() === productid.toString()) {
                if (isRemove) {
                  cartItems.splice(cartItems.indexOf(item), 1);
                } else {
                  item.unit = qty;
                }
                isExist = true;
              }
            });
            if (!isExist) {
              cartItems.push({product:product, unit:qty });    
               }
               cart.items = cartItems;
               return await cart.save()
            }
            else {
              const result =  new cartmodel({
              userid: usersid,
              items:[{product: product, unit: qty}]
          })
          return  await result.save();
        }
    }
    async getcartinfor(userid){
        return await cartmodel.findOne({userid:userid});
    }
}
module.exports = shoppingrepository;