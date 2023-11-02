const { shoppingrepository } = require('../Database');

// All Business logic will be here
class shoppingservice {
  constructor() {
    this.repository = new shoppingrepository();
  }
  async placeorder(userinput) {
    return await this.repository.createneworder(_id);
  }
  async deleteorders(userid,orderid) {
    return await this.repository.deleteorder(userid,orderid); 
  }
  async getorders(userid) {
    return await this.repository.getorder(userid);
  }
}

module.exports = shoppingservice;