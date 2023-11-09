const shoppingservice = require("../service/shopping-service");
const userauth = require('../middlewares/auth');
const {SubscribeMessage} = require('../message-broker/message-broker')
module.exports = (app,channel) => {
    
    const shopservice = new shoppingservice();
    
    SubscribeMessage(channel,shopservice);
    //place an order
    app.post('/shopping/place/order',userauth, async (req,res,next) => {
        const { _id } = req.user;
        const {deliveryaddress}= req.body;
        try {
            const data  = await shopservice.placeorder(_id,deliveryaddress,channel);
            return res.json(data);
        } catch (err) {
            next(err)
        }
    });
    //delete an order
    app.delete('/shopping/delete/order',userauth,async(req,res,next)=>{
        const {_id} = req.user;
        const {orderid} = req.body;
        try{
            const data = await shopservice.deleteorders(_id,orderid,channel)
            return res.json(data);
        }
        catch(err){
            next(err)
        }
    }) 
    //get orders info
    app.get('/shopping/order/infor',userauth, async (req,res,next) => {
        const { _id } = req.user;
        try {
            const  data  = await shopservice.getorders(_id);
            return res.json(data);
        } catch (err) {
            next(err);
        }

    });
      // add product to cart
  app.put('/shopping/cart/add',userauth, async (req,res,next) => {
    const { _id } = req.user;
    const { productid, quantity } = req.body; // product's info
    try {   
        const data =  await shopservice.addtocart(_id,productid, quantity, false)//false = add
        return res.json(data);
    } catch (err) {
        next(err)
    }
  });
  //delete product in cart
  app.delete('/shopping/cart/delete',userauth, async (req,res,next) => {
    const { _id } = req.user; // product's info
    const { productid } = req.body; // product's info
    let quantity = 0;
    try {   
        const data =  await shopservice.addtocart(_id,productid, quantity, true)//true = delete
        return res.json(data);
    } catch (err) {
        next(err)
    }
 });
  //get cart info
  app.get('/shopping/cart/infor', userauth, async (req,res,next) => {
    const { _id } = req.user; // users _id
    try {
        const  data  = await shopservice.getcartinfor(_id);
        return res.json(data);
    } catch (err) {
        next(err);
    }
});
}