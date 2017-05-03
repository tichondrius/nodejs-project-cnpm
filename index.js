var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var async = require('async');



//connection to db
var db = mongoose.connect('mongodb://admin:123456@ds155490.mlab.com:55490/quanlyshopquanao');

//var Book = require('./models/bookModel');
//var Product = require('./models/productModel');
var User = require('./models/userModel');
var Category = require('./models/categoryModel')
var Type = require('./models/typeModel');
var Story = require('./models/storyModel');
var Publisher = require('./models/publisherModel');
var Statement = require('./models/statementModel');
var Order = require('./models/orderModel');
var OrderDetail = require('./models/orderDetailModel');
var Product = require('./models/productModel');

var app = express();
app.use(cors());

var port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// Add headers


//var bookRouter = require('./Routes/bookRoutes')(Book, User);
//var productRouter = require('./Routes/productRoutes')(Product);
//var tokenRouter = require('./Routes/tokenRoutes');
var storyRouter = require('./Routes/storyRoutes')(Story, Category);
var categoryRouter = require('./Routes/categoryRoutes')(Category, User, Type);
var typeRouter = require('./Routes/typeRoutes')(Type);
var authRouter = require('./Routes/authRoutes')(User);
var userRouter = require('./Routes/userRoutes')(User);
var publisherRouter = require('./Routes/publisherRoutes')(Publisher);
var orderRouter = require('./Routes/orderRoutes')(Order);
var orderDetailRouter = require('./Routes/orderDetailRoutes')(OrderDetail);
var statementRouter =  require('./Routes/statementRoutes')(Statement);
var paymentRouter =  require('./Routes/paymentRoutes')(Order, OrderDetail);
//app.use('/api/Books', bookRouter);
//app.use('/api/Products', productRouter)

app.route('/token')
    .post(function(req, res){
        async.waterfall([
            function(callback){
                User.findOne({username: req.body.username,
                   password: req.body.password},
                   function(err, user){
                       if (err){
                           callback({message: 'Username hoặc password không đúng!'}, null);
                       }
                       else
                       {
                            callback(null, user);
                       }
                   });
            },
            function(user, callback){
                if (user)
                {  
                    var data = {};
                    data.username = req.body.username;
                    data.name = user.name;
                    jwt.sign(data, 'khintmam', {expiresIn: "2 days", algorithm: 'HS256'}, function(err, token){
                        callback(null,  {token: token, username: user.username, name: user.name});
                    });
                 }
                 else
                 {
                     callback({message: 'Username hoặc password không đúng!'}, null);
                 }
            }
        ], function(err, data){
            if (err)
            {
                res.status(404).send('Username hoặc password không đúng!');
            }
            else res.send(data);
        });
    });
//Middleware collects info from the token

app.use('/api', function(req, res, next){
    var auth = req.headers["authorization"];
    if (auth)
    {
        var token = auth.split(' ')[1];

        jwt.verify(token, 'khintmam', {algorithm: 'HS256'}, function(err, verified){
            if (err){
                req.auth = undefined;
            }
            else req.auth = verified;
            next();
        });
    }
    else {
        req.auth = undefined;
        next();
    }
    
});
app.use('/api/stories/', storyRouter);
app.use('/api/categories/', categoryRouter);
app.use('/api/types', typeRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/publishers', publisherRouter);
app.use('/api/orders', orderRouter);
app.use('/api/status', statementRouter);
app.use('/api/payment', paymentRouter);

//app.use('/api/orderDetail', orderDetailRouter);


//Require common:
var common = require('./common.js');
app.use(express.static(__dirname + '/public'));
app.listen(port, function(){
    console.log('The server is listening on PORT: ' + port);
});
