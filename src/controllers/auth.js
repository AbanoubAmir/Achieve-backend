//importing the packs
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

//importing needed models 
const users = require('../models/users'); 


exports.login = async (req , res , next) => {
    let fetchedUser = {};
    await users.findOne({
        where: {
            username: req.body.Username,
            password:req.body.Password
    }}).then((user)=>{
        fetchedUser = user.dataValues;
    });
    if(fetchedUser !== null){
        const token = jwt.sign({
            username: fetchedUser.username,
            name: fetchedUser.firstname + '' + fetchedUser.lastname,
            email: fetchedUser.email,
            type:'Employee',
            isAdmin : false , 
            message:'logged in successfully'
    } , process.env.JWTSecretKey, {expiresIn:'1d'});
        res.status(200).json({
                username: fetchedUser.username,
                name: fetchedUser.firstname + '' + fetchedUser.lastname,
                email: fetchedUser.email,
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