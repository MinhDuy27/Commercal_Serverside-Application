const shoppingservice = require("../service/shopping-service");
const userauth = require('../middlewares/auth');
const {SubscribeMessage} = require('../message-broker/message-broker')
module.exports = (app,channel) => {
    
    const shopservice = new shoppingservice();
    
    SubscribeMessage(channel,shopservice);
    //place an order
    app.post('/place/order',userauth, async (req,res,next) => {
        const { _id } = req.user;
        const {deliveryaddress}= req.body;
        try {
            const {data}  = await shopservice.placeorder(_id,deliveryaddress,channel);
            return res.json(data);
        } catch (err) {
            next(err)
        }
    });
    //delete an order
    app.delete('/admin/delete/orders/', async (req, res, next) => {
        const _id = req.body._id;
        const orderid = req.body.orderid;
        try {
          const { data } = await shopservice.deleteorders(_id, orderid);
          return res.status(200).json(data);
        } catch (err) {
          next(err);
        }
      });
    //get orders info
    app.get('/orders', userauth, async (req, res, next) => {
        const { _id } = req.user;
        try {
          const { data } = await shopservice.getorders(_id);
          return res.status(200).json(data.orders);
        } catch (err) {
          next(err);
        }
      });
      // add product to cart
    app.put('/cart/add',userauth, async (req,res,next) => {
    const { _id } = req.user;
    const { productid, quantity } = req.body; // product's info
    try {   
        const {data} =  await shopservice.addtocart(_id,productid, quantity, false)//false = add
        return res.json(data);
    } catch (err) {
        next(err)
    }
     });
  //delete product in cart
     app.delete('/cart/delete',userauth, async (req,res,next) => {
    const { _id } = req.user; // product's info
    const { productid } = req.body; // product's info
    let quantity = 0;
    try {   
        const {data} =  await shopservice.addtocart(_id,productid, quantity, true)//true = delete
        return res.json(data);
    } catch (err) {
        next(err)
    }
    });

  //get cart info
  app.get('/cart', userauth, async (req, res, next) => {
    const { _id } = req.user;
    try {
      const { data } = await shopservice.getcartinfor(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
  //get someone's order
  app.get('/orders/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
      const { data } = await shopservice.getorders(id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  //get all order
  app.get('/all/orders', async (req, res, next) => {
    try {
      const { data } = await shopservice.getallorders();
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/orders/detail/:id', async (req, res, next) => {
    const orderid = req.params.id;
    try {
      const {data} = await shopservice.getorderbyid(orderid);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
}