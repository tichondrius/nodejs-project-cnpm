var async    = require('async'),
    mongoose = require('mongoose');


var paymentController = function(Order, OrderDetail){

    var post = function(req, res){
        var reqOrder = new Order(req.body);
        var reqOderDetail = new OrderDetail(req.body);
        var errorOrder = reqOrder.validateSync();
        var errorOderDetail = reqOderDetail.validateSync();
        reqOrder.user =  ObjectId("58ea0731bab96280ae7eb1c9");
      
        var lstMessErr = [];
        var lstFieldErr = [];
        //Check error TH Order
        if (errorOrder) {
            if (errorOrder.name == 'ValidationError') {
               
                for (field in errorOrder.errors) {
                   lstFieldErr.push(field);
                   lstMessErr.push(errorOrder.errors[field].message);
                }
            }
        }
        //Check error TH OrderDetail
        if (errorOderDetail) {
            if (errorOderDetail.name == 'ValidationError') {
               
                for (field in errorOderDetail.errors) {
                    lstFieldErr.push(field);
                    lstMessErr.push(errorOderDetail.errors[field].message);
                }
            }
        }
        if (lstMessErr.length){
             res.status(404).json({lstFieldErr: lstFieldErr, lstMessErr: lstMessErr});
        }
        else{
         
            //Tam thoi do product la 1 list , chua tinh th nay. temp get 2 san pham
            //Khi co du thieu thuc su thi for de duyet vao bien nay.
            //Boi vi chua bik layout giao dien xe nhu the nao. Nen chua bik
            //cach thuc du lieu xe duoc luu nhu the nao
            //Chay du lieu ao thui
                var OrderDetailsFromUser  = [
                    {
                    product: reqOderDetail.product,
                    amount: reqOderDetail.amount,
                    price: reqOderDetail.price,
                },
                    {
                    product: reqOderDetail.product,
                    amount: reqOderDetail.amount,
                    price: reqOderDetail.price,
                    }
                ];
                    
            var orderdetails = OrderDetailsFromUser.map(function(od){
                return new OrderDetail(
                {
                    _id:  ObjectId(new ObjectId()),
                    order: reqOrder._id,
                    product: od.product,
                    amount: od.amount,
                    price: od.price 
                });
            });
            reqOrder.orderDetail =  orderdetails.map(function(od){
                    return od._id;
            })
            async.parallel([
              function(callback){
                     reqOrder.save(function(err){ 
                           if (err){
                                lstErr.push(-1);
                                lstMessErr.push('Có lỗi xảy ra trong quá trình xử lý');
                                callback({lstErr: lstErr, lstMessErr: lstMessErr}, reqOrder);
                           }
                           else{
                             
                               callback(null, reqOrder);
                           }
                     })

               },
              function(callback){
                   orderdetails.forEach(function(od){
                    od.save(function(err){
                    if(err){
                          lstErr.push(-1);
                          lstMessErr.push('Có lỗi xảy ra trong quá trình xử lý');
                          callback({lstErr: lstErr, lstMessErr: lstMessErr}, od);
                        
                    }
                    else{
                        callback(null, od);
                    }
                    });
                })
              }
            ], 
             function (err, results) {
                if (err) {
                    res.send(err);
                async.each(results, rollback, function () {
                    console.log('Rollback done.');
                });
            } else {
                res.send('Done');
                }
             });
            function rollback (doc, cb) {
                doc.remove(cb);
             }
        }
    }
    
    return {
        post: post
    }
}
module.exports = paymentController;

// function (errs, results) {
//     if (errs) {
//       async.each(results, rollback, function () {
//         console.log('Rollback done.');
//       });
//     } else {
//       console.log('Done.');
//     }
//   });
// function rollback (doc, callback) {
//   if (!doc) { callback(); }
//   else {
//     MyModel.findByIdAndRemove(doc._id, function (err, doc) {
//       console.log('Rolled-back document: ' + doc);
//       callback();
//     });
//   }