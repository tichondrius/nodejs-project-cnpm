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


var routes = function(Story, Category){
   var storyRouter = express.Router();



   var storyController = require('../controllers/storyController')(Story, Category);

   storyRouter.route('/')
    .get(storyController.get)
    .post(storyController.post)
    .put(upload.fields([
        { name: 'file_pre', maxCount: 1 },
        { name: 'file_main', maxCount: 100 },
    ]), storyController.put);
   

   storyRouter.route('/:storyID')
    .get(function(req, res){
        Story.findById(req.params.storyID).populate({
                path: 'cat',
                select: ['name', 'author', 'postby', 'types'],
                populate: [{
                    path: 'postby',
                    select: ['name']
                }, {
                    path: 'types',
                    select: ['name']
                }]
            })
            .exec(function (err, story) {
                if (err){
                    res.status(404).send(err);
                }
                else{
                    res.json(story);
                }
            });
       
    });
    return storyRouter;
};
module.exports = routes;