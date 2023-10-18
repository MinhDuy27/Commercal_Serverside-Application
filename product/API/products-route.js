const productservice = require('../service/product-service');
const userauth = require('./middlewares/auth')
const multer = require("multer")
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
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        const err = new Error('Only .png, .jpg and .jpeg format allowed!')
        err.name = 'ExtensionError'
        return cb(err);
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter:filefilter
  }).array('productimage', 4);
module.exports = (app) => {
    
    const proservice = new productservice();

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
   //get the list of all products
    app.get('/product', async (req,res,next) => {
        try {
            const data = await proservice.getproducts();        
            return res.status(200).json(data);
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