var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
ObjectId = require('mongodb').ObjectID;

var isNumberOrEmpty = function (val) {
    // This prevents return false if the user did not
    // enter any value
    if (val === null)
        return true
    if(val === -1){
         return false;
    }
    return true;
}

var setNumberOrUndefined = function (val) {
    //Resole error Cast to '' failed for value
    // this prevents set undefined if the user did not
    // enter any value
    if (val == '')
        return null
    // Return undefined prevents CastError
    // now a validator must validate if it's a number or not
    var v = Number(val)
    // return (isNaN(v))? undefined : v
    return (isNaN(v))? -1 : v
}
var orderModel = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    totalMoney: 
    {
            type: Number ,
            required: [true, 'Tổng tiền không được để trống'], 
            set: setNumberOrUndefined,
            validate: [isNumberOrEmpty, 'Tổng tiền phải là kiểu số'],
    },                 
    statement: {type: Schema.Types.ObjectId, ref: 'Statement', required: [true, 'Trạng thái đơn hàng không được để trống']},
    // orderDetail: { type: [Schema.Types.ObjectId], ref: 'Orderdetail', required: [true, 'Chi tiết đơn hàng không được để trống']},
    orderDetail: { type: [Schema.Types.ObjectId], ref: 'Orderdetail'},
},
{timestamps: true});

module.exports = mongoose.model('Order', orderModel);