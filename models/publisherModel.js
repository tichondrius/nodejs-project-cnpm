var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    
var publisherModel = new Schema({
    name: { type : String , required: [true, 'Tên nhà cung cấp không được bỏ trống']},
    isdelete:{type: Boolean, default:false}
}, 
{timestamps: true});

module.exports = mongoose.model('Publisher', publisherModel);