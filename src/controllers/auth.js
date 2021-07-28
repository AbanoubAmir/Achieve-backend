//importing the packs
const jwt = require('jsonwebtoken'); 
require('dotenv').config();
const bcrypt = require('bcrypt');
//importing needed models 
const users = require('../models/users'); 

exports.login = async (req , res , next) => {
    let fetchedUser = {};

    await users.findOne({
        where: {
            username: req.body.Username,
            isActive : true
        }}).then((user)=>{
        if(user)
        fetchedUser = user.dataValues;
        else
        fetchedUser = null;
    });

    if(fetchedUser !== null){

        let comparePass = await bcrypt.compare(req.body.Password , fetchedUser.password); 
        if(!comparePass)
        res.status(400).json({ message : 'Invalid username or password'});

        const token = jwt.sign({
            username: fetchedUser.username,
            name: fetchedUser.firstname + '' + fetchedUser.lastname,
            email: fetchedUser.email,
            role:fetchedUser.role,
            isAdmin : fetchedUser.isAdmin , 
            message:'logged in successfully'
    } , process.env.JWTSecretKey, {expiresIn:'1d'});
        res.status(200).json({
                username: fetchedUser.username,
                name: fetchedUser.firstname + '' + fetchedUser.lastname,
                email: fetchedUser.email,
                role: fetchedUser.role,
                isAdmin: fetchedUser.isAdmin , 
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

// exports.create = async (req , res , next) => {
//     const roles = require ('../models/users');
// const bcrypt = require('bcrypt');
// let hashedPass = await bcrypt.hash('123' , 10);
// roles.bulkCreate([
//     { username: 'SuperAdmin', firstname: 'Admin' , lastname : 'Admin' , email:'test@test.com' , password :hashedPass , isAdmin : true , isActive : true , ParentID : 'Org_01', role : 1  }
//   ]).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
//     return roles.findAll();
//   }).then(users => {
//     console.log(users) // ... in order to get the array of user objects
//   })
// }