var productController = function(Product){

    var post = function(req, res){
       
        var products = new Product(req.body);

		var error = products.validateSync();
		if(error && error.error['name']){
			res.send(error.errors['name'].message);
            return;
		}
		if(error && error.error['retail_price']){
			res.send(error.errors['retail_price'].message);
            return;
		}
		products.save(function(err){
            if(err){
                res.status(500).send(err);
            }
            else{
                 
                res.status(201).send(products);
            }
        });
    }
   
    var get = function(req,res){
        res.setHeader('Access-Control-Allow-Origin', '*');
        var query = {};

        if(req.query.name)
        {
            query.name = req.query.name;
        }
        Product.find(query, function(err,products){

            if(err)
                res.status(500).send(err);
            else {
                res.json(products);
            }
        });
    }   
    var getItem = function(req,res){   
        res.json(req.product.toJSON());   
    }
    var patch = function(req,res){
        if(req.body._id)
            delete req.body._id;

		for(var p in req.body)
        {
            req.product[p] = req.body[p];
        }
		var error = req.product.validateSync();
		if(error && error.error['name']){
			res.send(error.errors['name'].message);
            return;
		}
		if(error && error.error['retail_price']){
			res.send(error.errors['retail_price'].message);
            return;
		}
        req.product.save(function(err){
            if(err)
                res.status(500).send(err);
            else{
                res.json(req.product);
            }
        });
    }
   var deleted = function(req,res){
            req.product.remove(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.status(204).send('Removed');
                }
            });
     };
    return {
        post: post,
        get:get,
        getItem: getItem,
        patch: patch,
        delete : deleted
    }
}
module.exports = productController;