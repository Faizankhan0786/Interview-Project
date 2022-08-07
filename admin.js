var express = require('express');
var router = express.Router();
var pool=require('./pool')
var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");
/* GET home page. */
router.get('/adminlogin', function(req, res, next) {
  res.render('login', { msg: '' });
});

router.get('/logout', function(req, res, next) {
    localStorage.clear()
    res.render('login', { msg: '' });
  });
  
router.post('/checkadminlogin',function(req,res){
pool.query("select * from admins where emailid=? and password=?",[req.body.emailid,req.body.password],function(error,result){
if(error)
{
    res.render('login', { msg: 'Server Error' }); 
}
else
{
    if(result.length==0)
    {
        res.render('login', { msg: 'Invalid UserID/Password' });
    
    }
    else
    { localStorage.setItem("ADMIN",result)
        
    res.render('Dashboard',{result:result});

    }
}
})


})

module.exports = router;
