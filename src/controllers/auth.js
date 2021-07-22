//importing the packs
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

//importing needed models 
const prespectives = require('../models/milestones'); 
exports.login = async (req , res , next) => {
    if(req.body.Username == 'emamm' && req.body.Password == '123'){
        const token = jwt.sign({
            username: 'Mohamed_123',
            name: 'Mohamed Emamm',
            email: 'test@test.com',
            type:'Employee',
            isAdmin : false , 
            message:'logged in successfully'
    } , process.env.JWTSecretKey, {expiresIn:'1d'});
        res.status(200).json({
                username: 'Mohamed_123',
                name: 'Mohamed Emamm',
                email: 'test@test.com',
                type:'Employee',
                isAdmin : false , 
                token:token,
                message:'logged in successfully'
        }); 
    }
    else{
        res.status(400).json({
            message : 'Invalid username or password' ,
        });
    }
}

exports.getProfile = async (req , res , next) => {
        let Userdata = {
            Username: 'Mohamed_123',
            FirstName: 'Mohamed',
            LastName: 'Emamm',
            email: 'test@test.com',
        }; 
        console.log(prespectives.findAndCountAll());
        res.status(200).json({
            message: 'successful call' ,
            body: Userdata
        }); 
    
}