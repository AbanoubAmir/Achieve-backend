//importing the packs
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

//importing needed models 
const prespectives = require('../models/milestones'); 
exports.login = async (req , res , next) => {
    if(req.body.Username == 'emamm' && req.body.Password == '123'){
        let Userdata = {
            Username: 'Mohamed_123',
            FirstName: 'Mohamed',
            LastName: 'Emamm',
            email: 'test@test.com',
        }; 
        const token = jwt.sign(Userdata , process.env.JWTSecretKey, {expiresIn:'1d'});
        Userdata['token'] = token;
        res.status(200).json({
            message: 'successful call' ,
            body: Userdata
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