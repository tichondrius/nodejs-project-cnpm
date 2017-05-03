var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var statementModel = new Schema({
   name: String
},
{timestamps: true});

module.exports = mongoose.model('Statement', statementModel);