const express=require('express');
const app=express();
const port=3000;
const cors=require('cors');
const mongoose=require('mongoose');
const host='mongodb://localhost:27017/CourseDB';
app.use(express.json());
app.use(cors());

mongoose.connect(host)
.then(()=>console.log('Your Connexion To MongoDB Is Successsful (❁´◡`❁)'))
.catch(error=>console.error('There was an error connectiong to MongoDB',error));
const db=mongoose.connection;

const CourseRoute=require('./Routes/Course');
app.use('/course',CourseRoute);

app.listen(port,()=>{
    console.log(`The Server Is Executing On Port:http://localhost:${port}`);
});