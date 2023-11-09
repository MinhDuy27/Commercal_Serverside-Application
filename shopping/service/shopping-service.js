const { shoppingrepository } = require('../Database');
const {  validationError } = require('../Database/side-function/app-error');

// All Business logic will be here
class shoppingservice {
  constructor() {
    this.repository = new shoppingrepository();
  }
  async placeorder(_id,deliveryaddress,channel) {
    return await this.repository.createneworder(_id,deliveryaddress,channel);
  }
  async deleteorders(userid,orderid,channel) {
    return await this.repository.deleteorder(userid,orderid,channel); 
  }
  async getorders(userid) {
    return await this.repository.getorder(userid);
  }
  async addtocart(_id, productid, qty, isRemove) {
   return  await this.repository.addcartitem(_id, productid, qty, isRemove);
}
  async getcartinfor(userid){
    const result = await this.repository.getcartinfor(userid);
    if(!result)
      throw new validationError("nothing to show in cart");
    return result;
  }
}

module.exports = shoppingservice;