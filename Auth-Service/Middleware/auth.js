const jwt = require('jsonwebtoken');
const verifyToken=(req, res, next) => {
    const token=req.headers['Authorization'];
    if (!token) {  
        return res.status(403).send('The Token Is Required For Authentication');
    }
    jwt.verify(token,'alae_secret_key',(err, decoded)=>{
        if (err) {
            return res.status(401).send('Token invalid');
        }
        req.user=decoded;
        next();
    });
};
module.exports=verifyToken;