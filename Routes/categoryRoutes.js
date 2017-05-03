var express = require('express');
var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');




var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});


var upload = multer({ storage: storage });



var routes = function(Category, User, Type){
   var categoryRouter = express.Router();
   var categoryController = require('../controllers/categoryController')(Category, User, Type);

   
   categoryRouter.route('/')
    .get(categoryController.get)
    .post(categoryController.post);
    return categoryRouter;
};
module.exports = routes;