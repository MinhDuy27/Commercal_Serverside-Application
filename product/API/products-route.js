const productservice = require('../service/product-service');
const userauth = require('./middlewares/auth')
const multer = require("multer")
const {SubscribeMessage}  = require('../message-broker/message-broker');
// caching in redis
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT)
client.connect()
//multer to load image
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './Uploaded-image/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);  
    }
  });
  const filefilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") 
        cb(null, true)
    else {
        const err = new Error('Only .png, .jpg and .jpeg format allowed!')
        err.name = 'ExtensionError'
        return cb(err);
    }
  };
  const upload = multer({
    storage: storage,
    fileFilter:filefilter
  }).array('productimage', 4);

module.exports = (app,channel) => {
    
    const proservice = new productservice();
    SubscribeMessage(channel,proservice);
    //create product
    app.post('/product/create', upload,async(req,res,next) => {
        try {
            const listimage = req.files;
            const productimage =  new Array();
            listimage.map(item=>{
                productimage.push(item.path)
            })
            const { name,price,quantity ,type,status,specification,reasonforsale} = req.body;
            const  data  =  await proservice.createproduct({ name,price,quantity,type,status,specification,reasonforsale,productimage});
             return res.json(data);
        } catch (error) {
            next(error)    
        }  
    });
    //delete product by id
    app.delete('/product/delete/:id', async(req,res,next) => {
        try {
            const id = req.params.id;
             await proservice.deleteproductbyid(id);
            return res.json({message:"item deleted"});
        } catch (error) {
            next(error)    
        }
    });
    // get stuff by type (books,ticket,...)
    app.get('/product/category/:type', async(req,res,next) => {
        const type = req.params.type;
        try {
            const  data  = await proservice.getproductsbycategory(type)
            return res.json(data)
        } catch (error) {
            next(error)
        }
    });
    //get product by product's id
    app.get('/product/:id', async(req,res,next) => {
        try {
                const productid = req.params.id;
                const data  = await proservice.getproductbyid(productid);
                return res.status(200).json(data);
            } 
        catch (error) {
            next(error)
        }
    });
    // get the order by id list in cart
    app.get('/product/ids',userauth, async(req,res,next) => {
        try {
            const { ids } = req.body;
            const products = await proservice.getselectedproducts(ids);
            return res.status(200).json(products);
        } catch (error) {
            next(error)
        }
    });
  
    //get 20 product in collection each time
    app.get('/product/collection/:value', async (req,res,next) => {
        try {     
            const value = req.params.value;
            let data = await client.get(value)
            if(!data)
            {
                data = await proservice.getproducts(value);   
                await client.set(value,JSON.stringify(data),'EX', 3600, (error,result)=>{ //stringify:(data) :JavaScript objects -> JSON (data for exchange between server) 
                    if (error) next(error)
                });   
                return res.status(200).json(data);       
            } 
            return res.json(JSON.parse(data));//JSON.parse(data) : JSON ->  JavaScript objects(data for manipulating) 
        } catch (error) {
            next(error)
        }
    });
    //get products with price frow low to high
    app.get('/product/ascending/category/:type', async (req,res,next) => {
        try {
            const {data} = await proservice.getproductinpriceorder(1,req.params.type);        
            return res.status(200).json(data);
        } catch (error) {
            next(error)
        }
    });
    //get products with price frow high to low
    app.get('/product/descending/category/:type', async (req,res,next) => {
        try {
            const {data} = await proservice.getproductinpriceorder(-1,req.params.type);        
            return res.status(200).json(data);
        } catch (error) {
            next(error)
        }
    });
    
}