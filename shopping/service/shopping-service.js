const { shoppingrepository } = require('../Database');
const {  validationError } = require('../Database/side-function/app-error');
const {formatedata}  = require('../Database/side-function/side1');
// All Business logic will be here
class shoppingservice {
  constructor() {
    this.repository = new shoppingrepository();
  }
  async placeorder(userid,deliveryaddress,channel) {
    try {
      const orderresult = await this.repository.createneworder(userid,deliveryaddress,channel);
      if (orderresult == '') {
        console.log(orderresult);
        return formatedata({
          message: 'Nothing in cart',
        });
      }
      return formatedata(orderresult);
    } catch (err) {
      throw err;
    }
  }
  async deleteorders(userid, orderid) {
    try {
      const orders = await this.repository.deleteorder(userid, orderid);
      return formatedata(orders);
    } catch (err) {
      throw err;
    }
  }
  async getorders(customerid) {
    try {
      const orders = await this.repository.getorder(customerid);
      return formatedata(orders);
    } catch (err) {
      throw err;
    }
  }
  async addtocart(_id, productid, qty, isRemove) {
    const data =  await this.repository.addcartitem(_id, productid, qty, isRemove);
    return formatedata(data);

}
  async getcartinfor(userid){
    const result = await this.repository.getcartinfor(userid);
    if(!result)
      throw new validationError("nothing to show in cart");
    return formatedata(result);
  }
  async getallorders() {
    try {
      const orders = await this.repository.getallorders();
      return formatedata(orders);
    } catch (err) {
      throw err;
    }
  }
  async getorderbyid(orderid) {
    try {
      const order = await this.repository.getoneorder(orderid);
      return formatedata(order);
    } catch (err) {
      next(err);
    }
  }
}


module.exports = shoppingservice;