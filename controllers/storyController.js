var cloudinary = require('cloudinary');
var async = require('async');
cloudinary.config({
	cloud_name: 'dxnapa5zf',
	api_key: '219348637198157',
	api_secret: 'FJl9rCE5dTS_kgkX_rPvUyMTwZY'
});

var storyController = function(Story, Category){
    
    var get = function(req, res){
            var query = {};
            if (req.query.category) {
                query.cat = req.query.category;
            }
             Story.find(query)
            .populate({
                path: 'cat',
                select: ['name', 'author', 'postby', 'types'],
                populate: [{
                    path: 'postby',
                    select: ['name']
                }, {
                    path: 'types',
                    select: ['_id','name'],
                }]
            })
            .exec(function (err, story) {
                if (err){
                    res.status(404).send(err);
                }
                else res.json(story);
            // prints "The author is Bob Smith"
            });
       
       
    }
    
    var post = function(req,res){
        
    }
    var put = function(req, res){
        console.log(req.body);
        if (!req.auth){
            res.status(401).send('Authorized is required');
        }
        else
        {
           
        }
    }

    return {
        post: post,
        get: get,
        put: put
    }
}
module.exports = storyController;