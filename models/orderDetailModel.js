var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var common = require('../common.js');

var orderDetailModel = new Schema({
    order: {type: Schema.Types.ObjectId, ref: 'Order' },
    product:  { type: Schema.Types.ObjectId, ref: 'Product', required: [true, 'Sản phẩm không được để trống']},
    amount: 
    {
        type: Number,  
        required: [true, 'Số lượng không được để trống'] ,
        set: common.setNumberOrUndefined,
        validate: [common.isNumberOrEmpty, 'Số lượng nhập phải là kiểu số'],
    },
    price: 
    {
        type: Number,  
        required: [true, 'Giá sản phẩm không được để trống'] ,
        set: common.setNumberOrUndefined,
        validate: [common.isNumberOrEmpty, 'Giá nhập phải là kiểu số'],
    },
    is_cancel: {type: Boolean, default:false}
});

module.exports = mongoose.model('Orderdetail', orderDetailModel);