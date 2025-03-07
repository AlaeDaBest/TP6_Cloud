const mongoose=require('mongoose');
const StudentSchema=mongoose.Schema({
    name:{type:String},
    email:{type:String},
    course:[{type:mongoose.Schema.Types.ObjectId,ref:'Course'}]
});
module.exports=mongoose.model('Student',StudentSchema);