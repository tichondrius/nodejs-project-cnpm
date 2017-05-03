
var isNumberOrEmpty = function (val) {
    // This prevents return false if the user did not
    // enter any value
    console.log(val);
    if (val === null)
        return true
    if(val === -1){
         return false;
    }
    return true;
};

var setNumberOrUndefined = function (val) {
    //Resole error Cast to '' failed for value
    // this prevents set undefined if the user did not
    // enter any value
    if (val == '')
        return null;
    // Return undefined prevents CastError
    // now a validator must validate if it's a number or not
    var v = Number(val);
    
    // return (isNaN(v))? undefined : v
    return (isNaN(v))? -1 : v;
};
// var setObjectIdOrUndefined = function (val) {
  
//     //Resole error Cast to '' failed for value
//     if (val == '')
//         return null
//      const re = /^[a-fA-F0-9]{24}$/;
//      var result = re.test(val);
//      //console.log(result === false? -1: val);
//      return result === false? null: val;
// };
// var isObjectIdOrEmpty = function (val) {
//     // This prevents return false if the user did not
//     // enter any value
//     //console.log(val);
//     if (val === null)
//         return true
//     if(val === -1){
//          return false;
//     }
//     return true;
// };

exports.setNumberOrUndefined = setNumberOrUndefined;
exports.isNumberOrEmpty = isNumberOrEmpty;
// exports.setObjectIdOrUndefined = setObjectIdOrUndefined;
// exports.isObjectIdOrEmpty = isObjectIdOrEmpty;
