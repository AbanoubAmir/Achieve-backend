//importing the packs
const jwt = require('jsonwebtoken'); 
require('dotenv').config();
const bcrypt = require('bcrypt');

//importing needed models 
const users = require('../models/users'); 
const mailSender = require('../middleware/mail-sender'); 

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
            ID : fetchedUser.ID,
            selectedType : fetchedUser.selectedType,
            selectedDate : fetchedUser.selectedDate,
            defaultPage : fetchedUser.defaultPage,
            isResetPassword : fetchedUser.isResetPassword,
            organizationID : fetchedUser.organizationID
        } , process.env.JWTSecretKey, {expiresIn:'1d'});
        res.status(200).json({
                username: fetchedUser.username,
                name: fetchedUser.firstname + '' + fetchedUser.lastname,
                email: fetchedUser.email,
                role: fetchedUser.role,
                isAdmin: fetchedUser.isAdmin , 
                selectedType : fetchedUser.selectedType,
                selectedDate : fetchedUser.selectedDate,
                defaultPage : fetchedUser.defaultPage,
                isResetPassword : fetchedUser.isResetPassword,
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

exports.changePassword = async (req , res , next) => {
    try{
        let fetchedUser = {};
        await users.findOne({
            where: {
                ID: req.userData.ID,
                isActive : true
            }}).then((user)=>{
            if(user)
            fetchedUser = user.dataValues;
            else
            fetchedUser = null;
        });
        if(fetchedUser !== null){
    
            if(req.body.oldPassword !== null && req.body.oldPassword !== '' && req.body.oldPassword !== undefined){
                let comparePass = await bcrypt.compare(req.body.oldPassword , fetchedUser.password); 
                if(!comparePass)
                res.status(400).json({ message : 'Invalid old Password'});
            }
            let hashedPass  = req.body.Password ; 
            if(req.body.newPassword !== null && req.body.newPassword !== '' && req.body.newPassword !== undefined)
              hashedPass = await bcrypt.hash(req.body.newPassword, 10); 
            
            
            let defaultPage = fetchedUser.defaultPage; 
            if(req.body.defaultPage!== '' && req.body.defaultPage!== null && req.body.defaultPage!== undefined)
                defaultPage =  req.body.defaultPage ; 
          
            if(fetchedUser.isResetPassword){
                   await users.update({
                        password : hashedPass , 
                        defaultPage : defaultPage
                    } ,
                    {
                        where:{
                            ID: req.userData.ID,
                            isActive : true
                        },
                        returning: true,
                        plain: true
                                
                    }).then( updatedRecord => {
                    res.status(200).json({
                            message:'Password updated Successfully',
                            body: updatedRecord
                    });
                }) ;     
            }
            else{
               await users.update({
                    password : hashedPass , 
                    defaultPage : defaultPage , 
                    isResetPassword : true
                } ,
                {
                    where:{
                        ID: req.userData.ID,
                        isActive : true
                    },
                    returning: true,
                    plain: true
                            
                }).then( updatedRecord => {
                res.status(200).json({
                        message:'Password updated Successfully',
                        body: updatedRecord
                });
            }) ;    
            }     
        }
        
    }
    catch(error){
        console.log(error); 
        res.status(500).json({
            message : 'Something went wrong, plesae try again later'
        }) ; 
    }
    
    
}

exports.forgetPassword = async (req , res , next) => {
    try{
        if(req.body.Email != '' && req.body.Email != undefined &&  req.body.Email != null){
           let fetchedUser = {};
           await users.findOne({
               where: {
                   email: req.body.Email,
                   isActive : true
               }}).then((user)=>{
               if(user)
               fetchedUser = user.dataValues;
               else
               fetchedUser = null;
           });
           if(fetchedUser == null || fetchedUser == undefined ){
            res.status(400).json({
                message : 'The provided email is not registered yet'
            });
           }
           let tempPassword =  await mailSender.sendEmail(req.body.Email , 'forgetPassword');
           let hashedPass = await bcrypt.hash(tempPassword, 10); 
          await users.update({
            password : hashedPass , 
            isResetPassword : false
        } ,
        {
            where:{
                ID: fetchedUser.ID,
                isActive : true
            },
            returning: true,
            plain: true
                    
          }).then( updatedRecord => {          
            res.status(200).json({
                message : 'An email has been sent to you with all the needed information'
            });
          }) ;    
        }
        else{
            res.status(400).json({
                message : 'Please provide an email address'
            });
        }
    }
    catch(error){
        console.log(error); 
        res.status(500).json({
            message : 'Something went wrong, plesae try again later'
        }) ; 
    }
}

// exports.create = async (req , res , next) => {
//     const roles = require ('../models/users');
// const bcrypt = require('bcrypt');
// let hashedPass = await bcrypt.hash('123' , 10);
// roles.bulkCreate([
//     { username: 'SuperAdmin', firstname: 'Admin' , lastname : 'Admin' , email:'test@test.com' , password :hashedPass , isAdmin : true , isActive : true , organizationID : 'Org_01', role : 1 , isResetPassword:false  }
//   ]).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
//     return roles.findAll();
//   }).then(users => {
//     console.log(users) // ... in order to get the array of user objects
//   })
// }

