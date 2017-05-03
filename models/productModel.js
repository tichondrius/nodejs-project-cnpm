var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    
var productModel = new Schema({
	retail_price: {type: Number, required: [true, 'Số tiền không được để trống']},
	name: {type: String, trim: true, required: [true, 'Tên nhà sản phẩm không được để trống']},
	promotion_price: {type: Number},
	cost: {type: Number},
	category: {type: Schema.Types.ObjectId, ref: 'Category'}, 
	publisher: {type: Schema.Types.ObjectId, ref: 'Publisher'},
	img_main: [],
	qty: {type: Number}
	date_create: {type: Date},
	date_modify: {type: Date},
	isdelete: {type: Boolean, default: true}
},
{timestamps: true});

module.exports = mongoose.model('Product', productModel);