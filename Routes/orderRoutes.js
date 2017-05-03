var express = require("express");

var routes = function(Order){
    var orderRouter = express.Router();
    var orderController = require('../Controllers/orderController')(Order)
        orderRouter.route('/')
            .get(orderController.get);
          //middleware  
         orderRouter.use('/:orderId', function(req,res,next){
            Order.findById(req.params.orderId)
            .populate([{
            path: 'user',
            select: ['name', "address"]
            },
            {
                path: 'statement',
                select: ['name']
            }
            , 
            {
                path: 'orderDetail',
                select: ['orderId', 'product'],
                populate: ({
                    path: "product",
                    select: ['name']
                })
            }
            ])
            .exec(function(err, order)
            {
                if (err){
                    res.status(404).send(err);
                }
                else if(order)
                {
                    req.order = order;
                    next();
                }
                else
                {
                    res.status(404).send('Not order found');
                }
            });
        });
        orderRouter.route('/:orderId')
            .get(orderController.getItem)
            //Path: Update trang thai don hang
            .patch(orderController.patch)
  return orderRouter;
};

module.exports = routes;