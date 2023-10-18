const { shoppingrepository } = require('../Database');

// All Business logic will be here
class shoppingservice {
  constructor() {
    this.repository = new shoppingrepository();
  }

  async placeorder(userinput) {
    const { _id} = userinput;
    const existinguser = await this.repository.findusersbyid({ id });
    if (!existinguser) throw new notfoundError("user not found by provided id")
    return await this.repository.createneworder(_id);
    
  }
//
  async deleteorders(userid,orderid) {
    const existinguser = await this.repository.findusersbyid({ id });
    if (!existinguser) throw new notfoundError("user not found by provided id")
    return await this.repository.deleteorder(userid,orderid);
    
  }
  async getorders(userid) {
    const existinguser = await this.repository.findusersbyid({ id });
    if (!existinguser) throw new notfoundError("user not found by provided id")
    return await this.repository.getorder(userid);
    
  }
}

module.exports = shoppingservice;