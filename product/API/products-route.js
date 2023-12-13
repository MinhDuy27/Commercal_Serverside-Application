const productservice = require('../service/product-service');
const userauth = require('./middlewares/auth')
const multer = require("multer")
const {SubscribeMessage}  = require('../message-broker/message-broker');
// caching in redis
// const redis = require('redis');
// const client = redis.createClient(process.env.REDIS_PORT)
// client.connect()
//multer to load image
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, './Uploaded-image/');
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.originalname);  
//     }
//   });
//   const filefilter = (req, file, cb) => {
//     // reject a file
//     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") 
//         cb(null, true)
//     else {
//         const err = new Error('Only .png, .jpg and .jpeg format allowed!')
//         err.name = 'ExtensionError'
//         return cb(err);
//     }
//   };
//   const upload = multer({
//     storage: storage,
//     fileFilter:filefilter
//   }).array('productimage', 4);

module.exports = (app,channel) => {
    const proservice = new productservice();
    SubscribeMessage(channel,proservice);

    //create product
    app.post('/admin/create',async(req,res,next) => {
        try {
            const {
              uploaduserid,
              name,
              price,
              quantity,
              type,
              specs,
              reasonforsale,
              img,
            } = req.body;
            // validation
            const status = 'available';
            const specification = JSON.stringify(specs);
            const image = JSON.stringify(img);
            // console.log(img);
            const { data } = await proservice.createproduct({
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
            return res.json(data);
          } catch (err) {
            next(err);
          }
        });

    //delete product by id
    app.delete('/admin/delete/:id', async(req,res,next) => {
        try {
            const id = req.params.id;
            if (isValidObjectId(id)) {
              await proservice.deleteproductbyid(id);
              return res.status(200).json({ message: 'item deleted' });
            } else {
              return res.status(400).json({
                error: {
                  message: 'invalid id',
                },
              });
            }
        } catch (error) {
            next(error)    
        }
    });

    //approve product
    app.patch('/admin/approve-product/:productid', async (req, res, next) => {
          const productid = req.params.productid;
          try {
            const data = await proservice.approveproduct(productid);
            return res.status(200).json(data);
          } catch (err) {
            next(err);
          }
        },
      );
    // get stuff by type (books,ticket,...)
    app.get('/category/:type', async(req,res,next) => {
        const type = req.params.type;
        try {
            const  {data}  = await proservice.getproductsbycategory(type)
            return res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    });
    //get product by product's id
    app.get('/:id', async(req,res,next) => {
        try {
                const productid = req.params.id;
                const {data}  = await proservice.getproductbyid(productid);
                return res.status(200).json(data);
            } 
        catch (error) {
            next(error)
        }
    });
    // get the order by id list in cart
    // app.get('/ids',userauth, async(req,res,next) => {
    //     try {
    //         const { ids } = req.body;
    //         const products = await proservice.getselectedproducts(ids);
    //         return res.status(200).json(products);
    //     } catch (error) {
    //         next(error)
    //     }
    // });
    //get 20 product in collection each time
    app.get('/collection/:value', async (req,res,next) => {
        try {     
            const value = req.params.value;
            let data = await client.get(value)
            if(!data)
            {
                data = await proservice.getproducts(value);   
                await client.set(value,JSON.stringify(data),'EX', 10, (error,result)=>{  
                    if (error) next(error)
                });   
                return res.status(200).json(data);       
            } 
            return res.json(JSON.parse(data)); 
        } catch (error) {
            next(error)
        }
    });
    //get products with price frow low to high
    app.get('/ascending/category/:type', async (req,res,next) => {
        try {
            const {data} = await proservice.getproductinpriceorder(1,req.params.type);        
            return res.status(200).json(data);
        } catch (error) {
            next(error)
        }
    });
    //get products with price frow high to low
    app.get('/descending/category/:type', async (req,res,next) => {
        try {
            const {data} = await proservice.getproductinpriceorder(-1,req.params.type);        
            return res.status(200).json(data);
        } catch (error) {
            next(error)
        }
    });

     //get all products that being requested to upload
    app.get('/admin/upload-requests', async (req, res, next) => {
    try {
      //find product that status = upload-requested
      const { data } =  await proservice.getrequestingproduct('upload-requested');
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  //get all products that being requested to delete
    app.get('/admin/delete-requests', async (req, res, next) => {
    try {
      //find product that status != "upload-requested" && != available
      const { data } = await proservice.getrequestingproduct('delete');
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
    // get all prodcts that availble
     app.get('/all/available', async (req, res, next) => {
    try {
      const { data } = await proservice.getavailableproducts();
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
    
}