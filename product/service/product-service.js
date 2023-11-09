const { isValidObjectId } = require('mongoose')
const { productrepository } = require('../Database');
const { notfoundError, validationError } = require('../Database/side-function/app-error');


// All Business logic will be here
class productservice {
    constructor() {
        this.repository = new productrepository();
    }

    async createproduct(productinputs) {
        return await this.repository.createproduct(productinputs)
    }
//
    async deleteproductbyid(productid) {
        if (isValidObjectId(productid)) {
            const product = await this.repository.findbyid(productid);
            if (!product)
                throw new notfoundError("product id is not available");
            return this.repository.deleteproductbyid(productid)
        }
        throw new validationError("invalid ID")
    }
    // async getproducts() {
    //     const products = await this.repository.getproducts();
    //     let categories = {};
    //     products.map(({ type }) => {
    //         categories[type] = type;
    //     });
    //     return products
    // }

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
        return await this.repository.findproductsbyprice(sortorder, category);
    }

    async subscribeevents(payload){
        payload = JSON.parse(payload);
        const { event,productid,qty } = payload;
        
        switch(event){
            case 'placeorder':
                this.repository.updateproduct(productid, qty, true); // true = remove / fale = add more
                break;
            case 'deleteorder':
                this.repository.updateproduct(productid, qty, false); // true = remove / fale = add more
                break;
        }

    }
}


module.exports = productservice;