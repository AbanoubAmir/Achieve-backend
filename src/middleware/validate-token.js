const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 
module.exports = (req , res , next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; 
        const decodedtoken = jwt.verify(token,process.env.JWTSecretKey) ; 
        req.userData = {
            username : decodedtoken.username,
            name : decodedtoken.name ,  
            email : decodedtoken.email ,      
            ID : decodedtoken.ID ,                   
            selectedType : decodedtoken.selectedType,
            selectedDate : decodedtoken.selectedDate,
            defaultPage : decodedtoken.defaultPage ,
            organizationID : decodedtoken.organizationID,
            isAdmin : decodedtoken.isAdmin     
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