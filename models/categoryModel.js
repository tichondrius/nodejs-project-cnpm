var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var categoryModel = new Schema({
    name: String,
	date_create: {type: Date, "default":Date.now()},
	date_modify: Date,
	isdelete: {type: Boolean,"default": false}
});
module.exports = mongoose.model('Category', categoryModel);