var express = require("express");

var routes = function(Order, OrderDetail){
    var paymentRouter = express.Router();
    var paymentController = require('../Controllers/paymentController')(Order, OrderDetail)
        paymentRouter.route('/')
            .post(paymentController.post)

  return paymentRouter;
};

module.exports = routes;