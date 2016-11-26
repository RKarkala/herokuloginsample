var express = require('express');
var router = express.Router();
var path = require('path');
var bcrypt = require('bcryptjs');



 var salt = bcrypt.genSaltSync(10);
 module.exports = salt;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render("login");

});
router.post('/', function(req, res){
    var mongodb = require('mongodb');

    //We need to work with "MongoClient" interface in order to connect to a mongodb server.
    var MongoClient = mongodb.MongoClient;

    // Connection URL. This is where your mongodb server is running.
    var url = process.env.MLABURI;
  var user = req.body.user;
  var pass = req.body.pswd;
  // Use connect method to connect to the Server
  if(user.length==0 || pass.length==0){
      res.render("responses/blanklog");
  }else
  MongoClient.connect(url, function (err, db) {
    if (err) {
      res.send('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)

      // Get the documents collection
      var collection = db.collection('login');

    collection.find({username: user}).toArray(function (err, result) {

    if (err) {
      res.send(err);
    } else if (result.length) {
        var q = bcrypt.compareSync(pass, result[0].password);
        console.log(q);
        if(q===true){
            res.render("responses/login_success");
        }else{
            res.render("responses/incorrect");
        }

    }else{
        res.render("responses/incorrect");
    }
    //Close connection
    db.close();
  });



    }
  });
});
module.exports = router;
