var express = require('express');

var routes = function(User){
	var registeruserRoutes = express.Router();
	var registeruserRoutes = require('../controllers/registeruserRoutes')(User)
		registeruserRoutes.route('/')
			.get(registeruserController.get)
			.post(registeruserController.post);
    
			//Middleware for the route has productID
		  registeruserRoutes.use('/:userID', function(req, res, next){
			User.findById(req.params.userID, function(err, user){
				if (err){
					res.status(404).send(err);
				}
				else if (user){
					req.user = user;
					next();                    
				}
				else{
					res.status(404).send('Không tìm thấy tên đăng nhập');
				}
			});
		});
		registeruserRoutes.route('/:userID')
            .get(registeruserController.getItem)
            .patch(registeruserController.patch)
            .delete(registeruserController.delete)

    return registeruserRoutes;
};
module.exports = routes;
}