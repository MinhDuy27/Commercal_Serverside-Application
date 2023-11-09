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
      return await category === 'all' ? productsmodel.find().sort({price: sortorder}) : productsmodel.find({ type:category}).sort({price: sortorder})
  }
  async deleteproductbyid(productid){
        return await productsmodel.deleteMany({_id : productid})
  }
  async updateproduct(productid,qty,isplace){
      const product = await productsmodel.findById(productid);
      let quantity = product.quantity;
      let updatedquantity = isplace ? quantity - Number(qty) : quantity + Number(qty);
      return await productsmodel.findByIdAndUpdate(productid,{quantity : updatedquantity});
  }
}

module.exports = productrepository;