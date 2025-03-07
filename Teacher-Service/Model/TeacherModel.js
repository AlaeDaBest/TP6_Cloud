const mongoose=require('mongoose');
const TeacherSchema=mongoose.Schema({
    name:{type:String},
    bio:{type:String},
    course:[{type:mongoose.Schema.Types.ObjectId,ref:'Course'}]
});
module.exports=mongoose.model('Teacher',TeacherSchema);