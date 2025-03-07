const mongoose=require('mongoose');
const CourseSchema=new mongoose.Schema({
    title:{type:String},
    teacher_id:{type:mongoose.Schema.Types.ObjectId,ref:'Teacher'},
    description:{type:String},
    prix:{type:Number}
});
module.exports=mongoose.model('Course',CourseSchema);