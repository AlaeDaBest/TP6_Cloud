const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require('../Model/UserModel');
const verifyToken=require('../Middleware/auth');
router.post('/register',async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        return res.status(400).send('Tous les champs sont obligatoires');
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const newUser=new User({
        name:name,
        email:email,
        password:hashedPassword
    });
    try{
        newUser.save();
        res.status(201).json(newUser);
    }catch(error){
        res.status(500).send('Server Error',error);
    }
});

router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).send('All Fields Are Required');
    }
    const user=await User.findOne({email:email});
    // res.json(user);
    if(!user){
        return res.status(404).send('The User Does Not Existe');
    }
    const validPassword=await bcrypt.compare(password,user.password);
    if (!validPassword){
        return res.status(401).send('Password Incorrect!');
    }
    const token=jwt.sign({_id:user._id,email:email},'alae_secret_key');
    res.status(200).send({token});
})

router.get('/',async(req,res)=>{
    const users=await User.find();
    res.json(users);
})

router.get('/profile',verifyToken,async(req,res)=>{
    try{
        const user=await User.findById(req.user._id);
        if(!user){
            return res.status(404).send('This User Does Not Exist');
        }
        res.json(user)
    }catch(error){
        console.error('There was an error retreiving profile',error)
    }
});

module.exports=router;