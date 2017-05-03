var express = require("express");

var routes = function(Order){
    var orderRouter = express.Router();
    var orderController = require('../Controllers/orderController')(Order)
        orderRouter.route('/')
           // .post(orderController.post)
           // .get(orderController.get);

         orderRouter.use('/:orderId', function(req,res,next){
            order.findById(req.params.orderId, function(err,order){
                if(err)
                    res.status(500).send(err);
                else if(order)
                {
                    req.order = order;
                    next();
                }
                else
                {
                    res.status(404).send('no order found');
                }
            });
        });    
        orderRouter.route('/:orderId')
           // .get(orderController.getItem)
           // .patch(orderController.patch)
            //.delete(orderController.delete)

  return orderRouter;
};

module.exports = routes;