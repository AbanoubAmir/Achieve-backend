const bcrypt = require('bcrypt');
//importing needed models 
const users = require('../models/users'); 

exports.getSettings = async (req , res , next) => {
  try {
      let fetchedUser = {};
      await users.findByPk(req.userData.ID).then(result =>{
        fetchedUser = result.dataValues;
      });
      
      res.status(200).json({
            message:'Settings fetched Successfully',
            body: fetchedUser
      });
  }
  catch(error){
      console.log(error);
      res.status(500).json({
          message:'Something went wrong, please try again later',
      });
  }
}
exports.updateSettings = async (req , res , next) => {
    try{
        let fetchedUser = {};
        await users.update({
            selectedType: req.body.type,
            selectedDate: req.body.date
          }, {
            where: { ID: req.userData.ID},
            returning: true,
            plain: true
          });
        await users.findByPk(req.userData.ID).then(result =>{
            fetchedUser = result.dataValues;
          });
        res.status(200).json({
              message:'Settings updated Successfully',
              body: fetchedUser
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message:'Something went wrong, please try again later',
        });
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