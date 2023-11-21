const productsmodel = require("../models/products");

class productrepository {
  async createproduct({
    uploaduserid,
    name,
    price,
    quantity,
    type,
    status,
    specification,
    reasonforsale,
    image,
  }) {
    try {
      const product = new productsmodel({
        uploaduserid,
        name,
        price,
        quantity,
        type,
        status,
        specification,
        reasonforsale,
        image,
      });
      const productResult = await product.save();
      return productResult;
    } catch (err) {
      throw err;
    }
  }

  async getproducts() {
    try {
      return await productsmodel.find();
    } catch (err) {
      throw err;
    }
  }
  async getproducts(value) {
    return await productsmodel.find().skip(value*20).limit(20);
}

  async findbyid(productid) {
    try {
      const result = await productsmodel.find({ _id: productid });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async findbycategory(category) {
    try {
      const products = await productsmodel.find({ type: category });
      return products;
    } catch (err) {
      throw err;
    }
  }
  async findselectedproducts(selectedIds) {
    try {
      const products = await productsmodel
        .find()
        .where('_id')
        .in(selectedIds.map((_id) => _id))
        .exec();
      return products;
    } catch (err) {
      throw err;
    }
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
  async updateproductinformation(newinfo) {
    try {
      return await productsmodel
        .findOneAndUpdate(
          { _id: newinfo._id },
          {
            $set: {
              name: newinfo.name,
              price: newinfo.price,
              quantity: newinfo.quantity,
              type: newinfo.type,
              status: newinfo.status,
              specification: newinfo.specification,
              reasonforsale: newinfo.reasonforsale,
            },
          },
        )
        .exec();
    } catch (err) {
      throw err;
    }
  }
  async getuploadrequestproduct() {
    try {
      //get product that is requested upload
      const result = await productsmodel.find({ status: 'upload-requested' });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getdeleterequestproduct() {
    try {
      //get product that is requested delete
      const result = await productsmodel.find({
        $and: [
          { status: { $ne: 'upload-requested' } },
          { status: { $ne: 'available' } },
        ],
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getproductbyuploaduserid(userid) {
    try {
      const result = await productsmodel.find({ uploaduserid: userid });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async approveproductbyid(productid) {
    try {
      const myproduct = await productsmodel.find({ _id: productid });
      if (myproduct) {
        if (myproduct[0].status !== 'upload-requested') {
          return {
            error: {
              message: 'This product is not on upload request queue',
            },
          };
        }
        const result = await productsmodel.findOneAndUpdate(
          { _id: productid },
          { $set: { status: 'available' } },
        );

        return result;
      }

      return {
        error: {
          message: 'Product not found',
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async getavailableproduct() {
    try {
      const products = await productsmodel.find({ status: 'available' }).lean();
      return products;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = productrepository;