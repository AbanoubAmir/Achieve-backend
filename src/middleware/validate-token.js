const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 
module.exports = (req , res , next) => {
    try {
        console.log(req.headers);
        console.log(process.env.JWTSecretKey);

        const token = req.headers.authorization.split(" ")[1]; 
        const decodedtoken = jwt.verify(token,process.env.JWTSecretKey) ; 
        req.UserData = {
            Username : decodedtoken.username,
            name : decodedtoken.name ,  
            email : decodedtoken.email ,             
        }; 
        req.errorfiles = [] ;
        next() ; 
    }   
    catch(error){
        console.log(error); 
        if(error == 'jwt expired'){
            return res.status(401).json({
                message: 'Token has been expired' 
            }); 
        }
        res.status(403).json({
            message : 'You are unauthorized to make this request'
        }); 
    }
}