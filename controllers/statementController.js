var statusorderController = function(Statusorder){

    var post = function(req, res){
       
        var statusorders = new Statusorder(req.body);

        if(!req.body.name){
            res.status(400);
            res.send('Name is required');
        }
        else {
            statusorders.save();
            res.status(201);
            res.send(statusorders);
        }
    }
   
    var get = function(req,res){
        res.setHeader('Access-Control-Allow-Origin', '*');
        var query = {};

        // if(req.query.userId)
        // {
        //     query.userId = req.query.userId;
        // }
         Statusorder.find(query, function(err,statusorder){

            if(err)
                res.status(500).send(err);
            else {
                res.json(statusorder);
            }
        });


    }   
    var getItem = function(req,res){   
        res.json(req.statusorder.toJSON());   
    }
    var patch = function(req,res){
        if(req.body._id)
            delete req.body._id;

        if(!req.body.name){
            res.status(400);
            res.send('Name is required');
        }
        for(var p in req.body)
        {
            req.statusorder[p] = req.body[p];
        }

        req.statusorder.save(function(err){
            if(err)
                res.status(500).send(err);
            else{
                res.json(req.statusorder);
            }
        });
    }
   var deleted = function(req,res){
            req.statusorder.remove(function(err){
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
module.exports = statusorderController;