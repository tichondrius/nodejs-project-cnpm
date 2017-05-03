var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var userModel = new Schema({
    name: {type: String, required: [true, 'Họ tên không được để trống']},
    username: {type: String, required: [true, 'Tên đăng nhập không được để trống']},
    password: {type: String, required: [true, 'Mật khẩu không được để trống']},,
	role: {type: Schema.Types.ObjectId, ref: 'Role'},
    isdelete: {type: Boolean, default: true}
},
{timestamps: true});

module.exports = mongoose.model('User', userModel);