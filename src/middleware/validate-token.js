const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 
module.exports = (req , res , next) => {
    try {
        const token = req.headers.authorization; 
        const decodedtoken = jwt.verify(token,process.env.JWTSecretKey) ; 
        req.UserData = {
            Username : decodedtoken.Username,
            Firstname : decodedtoken.Firstname , 
            Lastname : decodedtoken.Lastname , 
            email : decodedtoken.email ,             
        }; 
        req.errorfiles = [] ;
        next() ; 
    }   
    catch(error){
        if(error == 'jwt expired'){
            return res.status(401).json({
                error: 'Token has been expired' 
            }); 
        }
        res.status(403).json({
            error : 'You are unauthorized to make this request'
        }); 
    }
}