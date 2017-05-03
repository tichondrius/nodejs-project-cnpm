var cloudinary = require('cloudinary');
var async = require('async');
cloudinary.config({
	cloud_name: 'dxnapa5zf',
	api_key: '219348637198157',
	api_secret: 'FJl9rCE5dTS_kgkX_rPvUyMTwZY'
});

var sendJsonResponse = function(res,status,content){
	res.status(status);
	res.json(content);
};





var categoryController = function(Category, User, Type){
   
    var get = function(req, res){
		 Category.find({})
        	.exec(function(err, categories)
			{
				if(!categories){
					sendJsonResponse(res,404,{
						"message": "Categories is empty"
					});
					return;
				}
				if(err){
					sendJsonResponse(res,404,err);
				}
				sendJsonResponse(res,200,categories);
			});
		
       
    }

    var post = function(req, res){
		Category.create({
				name: req.body.name,
				date_modify: Date.now()
			},function(err,category){
				if(err){
					sendJsonResponse(res,400,err);
				}else{
					sendJsonResponse(res,201,category);
				}
			});
       
    }

    return {
        get: get,
        post: post
    }
}
var categoryController = function(Category, User, Type){
    var put = function(req, res){

        if (!req.auth){
            res.status(401).send('Authorized is required');
            return;
        }
        var username = req.auth.username;
        var model = JSON.parse(req.body.model);
        var lstErr = [];
        var lstMessErr = [];

        if (!model.name || model.name == ""){
            lstErr.push(1);
            lstMessErr.push("Tên truyện không được để trống");
        }
        if (!model.author || model.author == "")
        {
            lstErr.push(2);
            lstMessErr.push("Tên tác giả hoặc nguồn không được để trống");
        }
        if (!model.introduce || model.introduce == "")
        {
            model.introduce = "Chưa có giới thiệu truyện";
        }
        if (model.type != 1 && model.type != 2)
        {
            model.type = 1;
        }
        if (!model.types || model.types.length == 0){
            lstErr.push(3);
            lstMessErr.push("Truyện chưa có thể loại");
        }
        if (!model.img || model.img == "") 
        {
            model.img = 'no-image-chapter.jpg';
        }
        var types = [];
        model.types.forEach(function(element){
            if (element != "")
            {
                types.push(element);
            }
        });
        if (lstErr.length)
        {
            res.status(404).json({lstErr: lstErr, lstMessErr: lstMessErr});
        }
        else
        { 
           async.waterfall([
              function(callback){ //find the user
                  User.findOne({username: username}, function(err, user){
                      if (err || !user){
                          lstErr.push(-1);
                          lstMessErr.push('Có lỗi xảy ra trong quá trình xử lý');
                          callback({lstErr: lstErr, lstMessErr: lstMessErr}, null);
                      }
                      else
                      {
                          callback(null, user);
                      }
                });
              },
              function(user, callback){ // create new category
                  var category = new Category({
                        name: model.name,
                        author: model.author,
                        date: new Date(),
                        totalchap: 0,
                        img: model.img,
                        type: model.type,
                        introduce: model.introduce,
                        postby: user._id,
                        stories: [],
                        types: types
                    });
                    category.save(function(err){
                        if (err){
                              lstErr.push(-1);
                              lstMessErr.push('Có lỗi xảy ra trong quá trình xử lý');
                              callback({lstErr: lstErr, lstMessErr: lstMessErr}, null);
                        }
                        else
                        {
                            callback(null, user, category);
                        }
                    });
              }, function(user, category, callback){ //add cateogry to user
                   user.categories.push(category._id);
                   user.save(function(err){
                        if (err){
                             lstErr.push(-1);
                             lstMessErr.push('Có lỗi xảy ra trong quá trình xử lý');
                             callback({lstErr: lstErr, lstMessErr: lstMessErr}, null);
                        }
                        else
                        {
                            var tasks = types.map(function(type){
                                return function(callback){
                                     Type.findByIdAndUpdate(type, {$push: {"categories": category._id}}, 
                                         {safe: true, upsert: true, new : true}, function(err, model){
                                             if (err){
                                                  lstErr.push(-1);
                                                  lstMessErr.push('Có lỗi xảy ra trong quá trình xử lý');
                                                  callback({lstErr: lstErr, lstMessErr: lstMessErr}, null);
                                             }
                                             else
                                             {
                                                  callback(null, true);
                                             }
                                         });
                                }
                            });

                            async.parallel(tasks, function(err, result){
                                if (err)
                                {
                                    callback(err, null);
                                }
                                else
                                {

                                    if (req.file)
                                    {
                                        cloudinary.uploader.upload(req.file.path, function(result){
                                            
                                            if (result.error)
                                            {
                                                lstErr.push(-1);
                                                lstMessErr.push('Có lỗi xảy ra trong quá trình xử lý');
                                                callback({lstErr: lstErr, lstMessErr: lstMessErr}, null);
                                            }
                                            else
                                            {
                                                category.img = result.url;
                                                category.save(function(err){
                                                    if (err){
                                                        lstErr.push(-1);
                                                        lstMessErr.push('Có lỗi xảy ra trong quá trình xử lý');
                                                        callback({lstErr: lstErr, lstMessErr: lstMessErr}, null);
                                                    }
                                                    else
                                                        {
                                                            callback(null, category);
                                                        }
                                                    });
                                                }
                                            });
                                        } 
                                        else{ callback(null, category)};
                                }
                            })
                        }

                   });
           
              }
              
           ], function(err, result){
               if (err){
                   res.status(404).json(err).end();
               }
               else
               {
                   res.json(result);
               }

           });
           
        }
    }
    var get = function(req, res){
         Category.find({})
        .limit(req.body.qty == undefined ? 20 : Number(req.body.qty))
        .populate([{
            path: 'postby',
            select: ['name']
        },
        {
            path: 'types',
            select: ['name']
        }, {
            path: 'stories',
            select: ['name', 'part'],
            options: {sort: { 'date': -1 }, limit: 1}
        }])
        .exec(function(err, categories)
        {
            if (err){
                res.status(404).send(err);
            }
            else  res.json(categories);
        });
    }
    var post = function(req, res){

    }

    return {
        put: put,
        get: get,
        post: post
    }
}


module.exports = categoryController;