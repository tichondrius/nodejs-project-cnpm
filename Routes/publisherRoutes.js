var express = require("express");

var routes = function(Publisher){
    var publisherRouter = express.Router();
    var publisherController = require('../Controllers/publisherController')(Publisher)
        publisherRouter.route('/')
            .post(publisherController.post)
            .get(publisherController.get);

         publisherRouter.use('/:publisherId', function(req,res,next){
            Publisher.findById(req.params.publisherId, function(err,publisher){
                if(err)
                    res.status(500).send(err);
                else if(publisher)
                {
                    req.publisher = publisher;
                    next();
                }
                else
                {
                    res.status(404).send('no publisher found');
                }
            });
        });    
        publisherRouter.route('/:publisherId')
            .get(publisherController.getItem)
            .patch(publisherController.patch)
            .delete(publisherController.delete)

  return publisherRouter;
};

module.exports = routes;