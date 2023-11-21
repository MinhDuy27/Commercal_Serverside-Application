const { isValidObjectId } = require('mongoose')
const { productrepository } = require('../Database');
const { notfoundError, validationError } = require('../Database/side-function/app-error');
const {formatedata}  = require('../Database/side-function/side1');


// All Business logic will be here
class productservice {
    constructor() {
        this.repository = new productrepository();
    }
    async createproduct(productinputs) {
        try {
          const productresult = await this.repository.createproduct(productinputs);
          return formatedata(productresult);
        } catch (err) {
          throw err;
        }
      }
//
    async deleteproductbyid(productid) {
        try {
        const result = await this.repository.deleteproductbyid(productid);
        return formatedata(result);
        } catch (err) {
        throw err;
        }
    }
    async getproducts() {
        try {
          const products = await this.repository.getproducts();
          let categories = {};
          products.map(({ type }) => {
            categories[type] = type;
          });
          return formatedata(products);
        } catch (err) {
          throw err;
        }
      }
    async approveproduct(productid) {
        try {
          const result = await this.repository.approveproductbyid(productid);
          // console.log(result);
          return result;
        } catch (err) {
          throw err;
        }
      }
    
    async getproducts(value) {
        const products = await this.repository.getproducts(value);
        let categories = {};
        products.map(({ type }) => {
            categories[type] = type;
        });
        return products
    }

    async getproductsbycategory(category) {
        return await this.repository.findbycategory(category);
    }

    async getselectedproducts(selectedIds) {
        return await this.repository.findselectedproducts(selectedIds);
    }

    async getproductbyid(productid) {
        if (isValidObjectId(productid)) {
            const product = await this.repository.findbyid(productid);
            if (!product)
                throw new notfoundError("product id is not available");
            return product
        }
        throw new validationError("invalid ID")
    }

    async getproductinpriceorder(sortorder, category) { // 1  ascending , -1 descending
        
      const data = await this.repository.findproductsbyprice(sortorder, category);
      return formatedata(data)
    }

    async subscribeevents(payload){
        payload = JSON.parse(payload);
        const {event, productid,qty } = payload;
        switch(event){
            case 'placeorder':
                this.repository.updateproduct(productid, qty, true); // true = remove / fale = add more
                break;
            case 'deleteorder':
                this.repository.updateproduct(productid, qty, false); // true = remove / fale = add more
                break;
            case 'deleteproduct':
              this.repository.deleteproductbyid(productid)
        }

    }
    async updateproduct(newinfo) {
        try {
          const product = await this.repository.updateproductinformation(newinfo);
          return 'Product delete request sent';
        } catch (err) {
          throw err;
        }
      }
  
      async getrequestingproduct(request) {
        try {
          //get upload request
          if (request === 'upload-requested') {
            const product = await this.repository.getuploadrequestproduct();
            return formatedata(product);
          } else if (request === 'delete') {
            //get delete request
            const product = await this.repository.getdeleterequestproduct();
            return formatedata(product);
          } else {
            return {};
          }
        } catch (err) {
          throw err;
        }
      }
    
      async getproductbyuploaduser(userid) {
        try {
          const product = await this.repository.getproductbyuploaduserid(userid);
          return formatedata(product);
        } catch (err) {
          throw err;
        }
      }
    
      async getavailableproducts() {
        try {
          const products = await this.repository.getavailableproduct();
          // let categories = {};
          // products.map(({ type }) => {
          //   categories[type] = type;
          // });
          return formatedata(products);
        } catch (err) {
          throw err;
        }
      }
}


module.exports = productservice;