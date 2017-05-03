var express = require("express");

var routes = function(Statusorder){
    var statusorderRouter = express.Router();
    var statusorderController = require('../Controllers/statementController')(Statusorder)
        statusorderRouter.route('/')
            .post(statusorderController.post)
            .get(statusorderController.get);

         statusorderRouter.use('/:statusorderId', function(req,res,next){
            Statusorder.findById(req.params.statusorderId, function(err,statusorder){
                if(err)
                    res.status(500).send(err);
                else if(statusorder)
                {
                    req.statusorder = statusorder;
                    next();
                }
                else
                {
                    res.status(404).send('no statusorder found');
                }
            });
        });    
        statusorderRouter.route('/:statusorderId')
            .get(statusorderController.getItem)
            .patch(statusorderController.patch)
            .delete(statusorderController.delete)

  return statusorderRouter;
};

module.exports = routes;