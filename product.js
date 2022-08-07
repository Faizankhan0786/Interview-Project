var express = require('express');
var router = express.Router();
var pool=require("./productpool")
var upload=require("./productmulter")

/* GET home page. */
router.post('/addnewproduct',upload.single('picture'), function(req, res, next) {
  console.log("BODY",req.body)
  console.log("FILE",req.file)
  pool.query("insert into products(producttype, productlist, productname, productrate, productstock, picture)values(?,?,?,?,?,?,)",[producttype,req.query.productlist,req.query.producname,req.query.productrate,req.query.productstock,req.file.originalname],
  function(error,result){
    if (error) {
      res.render('product',{msg:'Server Error:Fail to Submit Record'});
    } else {
      res.render('product',{msg:'Record Submitted.....'});
    }
  })
  res.render('product');
});


router.get('/productinterface', function(req, res, next) {
  res.render('product',{msg:''});
});

router.get('/fetchallproducttype', function(req, res, next) {
  pool.query("select * from producttype",function(error,result){
    if(error)
    { console.log(error)
    res.status(500).json([])
    }
    else
    {
      res.status(200).json(result)
    }
  })

});


router.get('/fetchallproductlist', function(req, res, next) {
  pool.query("select * from productlist where productid=?",[req.query.productid],function(error,result){
    if(error)
    { console.log(error)
    res.status(500).json([])
    }
    else
    {
      res.status(200).json(result)
    }

  })

});

router.get('/fetchallproductname', function(req, res, next) {
  console.log(req.query)
  pool.query("select * from productname where modelid=?",[req.query.modelnameid],function(error,result){
    if(error)
    { console.log(error)
    res.status(500).json([])
    }
    else
    {  console.log(result)
      res.status(200).json(result)
    }

  })

});

router.get('/fetchallproductrate', function(req, res, next) {
  pool.query("select * from productrate where modelnameid=?",[req.query.modelnameid],function(error,result){
    if(error)
    { console.log(error)
    res.status(500).json([])
    }
    else
    {
      res.status(200).json(result)
    }

  })

});

router.get('/fetchallproductstock', function(req, res, next) {
  pool.query("select * from productstock where modelnameid=?",[req.query.modelnameid],function(error,result){
    if(error)
    { console.log(error)
    res.status(500).json([])
    }
    else
    {
      res.status(200).json(result)
    }

  })

});

module.exports = router;
