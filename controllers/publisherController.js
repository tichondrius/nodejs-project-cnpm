var publisherController = function(Publisher){

    var post = function(req, res){
       
        var publishers = new Publisher(req.body);
        //check error
        var error = publishers.validateSync();
        if (error && error.errors['name']) {
            res.send(error.errors['name'].message);
            return;
        }
        publishers.save(function(err){
            if(err){
                
                res.status(500).send(err);
            }
            else{
                 
                res.status(201).send(publishers);
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
        Publisher.find(query, function(err,publishers){

            if(err)
                res.status(500).send(err);
            else {
                res.json(publishers);
            }
        });
    }   
    var getItem = function(req,res){   
        res.json(req.publisher.toJSON());   
    }
    var patch = function(req,res){
       //res.setHeader('Access-Control-Allow-Origin', '*');
        if(req.body._id){
            delete req.body._id;
        }
      
        for(var p in req.body)
        {
            req.publisher[p] = req.body[p];
        }
        var error = req.publisher.validateSync();
        if (error && error.errors['name']) {
            res.send(error.errors['name'].message);
            //Fix loi:Can't set headers after they are sent . Resolve: Dung lenh teturn
            return;
        }
        req.publisher.save(function(err){
            if(err)
                res.status(500).send(err);
            else{
                res.json(req.publisher);
            }
        });
    }
   var deleted = function(req,res){
            req.publisher.remove(function(err){
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
module.exports = publisherController;