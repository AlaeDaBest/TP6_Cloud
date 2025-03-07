const jwt=require('jsonwebtoken');
const verifyToken=(req,res,next)=>{
    const token=req.headers['Authorization'];
    res.json(token);
    if(!token){
        return res.status(403).json(token);
    }
    jwt.verify(token,'alae_secret_key',(error,decoded)=>{
        if(error){
            return res.status(401).send('Token Invalid!');
        }
        req.user=decoded;
        next();
    });
};
module.exports=verifyToken;