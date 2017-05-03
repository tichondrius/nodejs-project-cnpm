var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var userModel = new Schema({
    name: String
}),
{timestamps: true});

module.exports = mongoose.model('Role', roleModel);