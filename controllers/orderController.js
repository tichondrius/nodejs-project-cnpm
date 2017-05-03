var orderController = function(Order){

    var get = function(req,res){
        res.setHeader('Access-Control-Allow-Origin', '*');
        var query = {};

        if(req.query.userId)
        {
            query.userId = req.query.userId;
        }
        Order.find({})
        .limit(req.body.qty == undefined ? 20 : Number(req.body.qty))
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
        .exec(function(err, orders)
        {
            if (err){
                res.status(404).send(err);
            }
            else  res.json(orders);
        });


    }   
    var getItem = function(req,res){ 
       
       res.json(req.order.toJSON());   
    }
    var patch = function(req,res){
        if(req.body._id){
            delete req.body._id;
        }
        if(!req.body.statement){
           req.order['statement'] =  req.body['statement'];
           var error = req.order.validateSync(); 
           if (error && error.errors['statement']) {
            res.send(error.errors['statement'].message);
            //Fix loi:Can't set headers after they are sent . Resolve: Dung lenh teturn
            return;
            }
        }
        req.order.statement = ObjectId(req.body.statement);
        req.order.save(function(err){
            if(err)
                res.status(500).send(err);
            else{
                res.json(req.order);
            }
        });
    }
   
    return {
        get:get,
        getItem: getItem,
        patch: patch,
    }
}
module.exports = orderController;