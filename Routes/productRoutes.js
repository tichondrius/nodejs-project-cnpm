var express = require('express');

var routes = function(Product){
	var productRouter = express.Router();
	var productController = require('../controllers/productController')(Product)
		productRouter.route('/')
			.get(productController.get)
			.post(productController.post);
    
			//Middleware for the route has productID
		  productRouter.use('/:productID', function(req, res, next){
			Product.findById(req.params.productID, function(err, product){
				if (err){
					res.status(404).send(err);
				}
				else if (product){
					req.product = product;
					next();                    
				}
				else{
					res.status(404).send('Không tìm thấy sản phẩm');
				}
			});
		});
		productRouter.route('/:productID')
            .get(productController.getItem)
            .patch(productController.patch)
            .delete(productController.delete)

    return productRouter;
};
module.exports = routes;