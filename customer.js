const { request } = require('express');
var express = require('express');
var router = express.Router();
var pool=require("./pool")
var upload=require("./multer")
var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

/* GET home page. */
router.post(
  "/addnewcustomer",
  upload.single("picture"), 
  function(req, res, next) {
   console.log("BODY", req.body);
   console.log("FILE:",  req.file);
  var name=req.body.firstname + " " + req.body.lastname;  
  pool.query(
    "insert into customers(customername,gender,dob,emailaddress,mobileno,address,state,city,picture,password)values(?,?,?,?,?,?,?,?,?,?)",
    [
      name,
      req.query.gender,
      req.query.birthdate,
      req.query.email,
      req.query.mobileno,
      req.query.address,
      req.query.state,
      req.query.city,
      req.file.originalname,
      req.query.password,
    ],
  function(error,result){
     if (error) {
        res.render('customer',{msg:'Server Error:Fail to Submit Record'});
      } else {
        res.render('customer',{msg:'Record Submitted.....'});
      }
    }
  );
  }
);

router.post("/editpicture",upload.single('picture'),function(req,res){

  pool.query("update customers set picture=? where customerid=?",[req.file.originalname,req.body.cid],function(error,result){
    
    if (error) {
      console.log(error);
       res.redirect("/customer/displayallcustomers");
     } else {
       res.redirect("/customer/displayallcustomers");
     }


  })

})

router.get('/customerinterface', function (req, res, next) {
try
{
  if(localStorage.getItem("ADMIN")==null)
  res.render('login', { msg: '' });
  else 
  { res.render('customer',{msg:''}); }
}
 catch(e){
  res.render('login', { msg: '' });
}

});

router.get('/fetchallstates', function(req, res, next) {
  pool.query("select * from states", function(error,result){
    if (error) {
     console.log(error);
     res.status(500).json([]);
    } else {
     res.status(200).json(result);
    }
  });
 });

router.get('/fetchallcities', function(req, res, next) {
  pool.query(
    "select * from cities where stateid=?",
    [req.query.stateid],
    function (error, result) {
    if (error) {
     console.log(error);
     res.status(500).json([]);
    } else {
     res.status(200).json(result);
    }
   });
});


router.get('/displayallcustomers',function(req,res){
  try
  {
    if(localStorage.getItem("ADMIN")==null)
    res.render('login',{msg:''});
  }
   catch(e){
    res.render('login', { msg: '' });
  }
  
  
  
  
  
  pool.query(
    "select C.*,(select S.statename from states S where S.stateid=C.state) as sname,(select CI.cityname from cities CI where CI.cityid=C.city) as cname from customers C",
    function(error,result){
      if(error) {
      console.log(error);
      res.render("displayallcustomers",{ data: [] });
      } else {
       console.log(result)
       res.render("displayallcustomers",{data:result});
     }
    }
  );
});

router.get('/displaybyid',function(req,res){
  pool.query(
    "select C.*,(select S.statename from states S where S.stateid=C.state) as sname,(select CI.cityname from cities CI where CI.cityid=C.city) as cname from customers C where C.customerid=?",
    [req.query.cid],
    function (error, result) {
      if (error) {
      console.log(error);
      res.render("displaybycustomerid",{ data: [] });
      } else {
       console.log(result);
       res.render("displaybycustomerid",{ data: result });
      }
     }
    );
   }
  );
  router.get("/displaypicture",function(req, res, next) {
 
  return res.render("displaypicture",{'cid':req.query.cid,'picture':req.query.picture})
  })
 
 
  router.get("/editdeletecustomer",function(req, res, next) {
     if(req.query.btn=="Edit")
     {
    var name=req.query.firstname + " " + req.query.lastname;  
    pool.query(
      "update customers set customername=?,gender=?,dob=?,emailaddress=?,mobileno=?,address=?,state=?,city=?,password=? where customerid=?",
      [
        name,
        req.query.gender,
        req.query.birthdate,
        req.query.email,
        req.query.mobileno,
        req.query.address,
        req.query.state,
        req.query.City,
        
        req.query.password,
        req.query.cid
      ],
    function(error,result){
       if (error) {
         console.log(error);
          res.redirect("/customer/displayallcustomers");
        } else {
          res.redirect("/customer/displayallcustomers");
        }
       }
      );
     }
     else if(req.query.btn=="Delete")
     {
       pool.query("delete from customers where customerid=?",[req.query.cid],function(error,result){

        if (error) {
          console.log(error);
           res.redirect("/customer/displayallcustomers");
         } else {
           res.redirect("/customer/displayallcustomers");
         }


       })



     }
     }
    ); 








module.exports = router;