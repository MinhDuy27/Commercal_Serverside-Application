const productsmodel = require("../models/products");

class productrepository {
  async createproduct({
    name,
    price,
    quantity,
    type,
    status,
    specification,
    reasonforsale,
    productimage
  }) {
      const product = new productsmodel({
        name,
        price,
        quantity,
        type,
        status,
        specification,
        reasonforsale,
        productimage
      });
     
      return  await product.save();
  }

  async getproducts() {
      return await productsmodel.find();
  }

  async findbyid(productid) {
      return await productsmodel.findOne({_id: productid});
    
  }

  async findbycategory(category) {
      return await productsmodel.find({ type: category });
  }
  async findselectedproducts(selectedIds) {
   
      return  await productsmodel.find()
        .where("_id")
        .in(selectedIds.map((_id) => _id))
  }
  async  findproductsbyprice(sortorder,category) {
      if(category==='all')
      {
        return await productsmodel.find({})
        .sort({price: sortorder})
      }
      else{
        return await productsmodel.find({ type: category })
        .sort({price: sortorder})
     
      }
  }
  async deleteproductbyid(productid){
        return await productsmodel.deleteMany({_id : productid})
  }
}

module.exports = productrepository;