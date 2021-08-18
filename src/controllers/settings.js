//import needed packs
const Sequelize  = require('sequelize');
const common = require('../shared/commonMethods');

//import needed models 
const settings = require('../models/settings');

exports.getSettings = async (req , res , next) =>{
    try {
        let fetchedRow = {};
        if(req.userData.isAdmin){
            await settings.findOne({
                where:{
                    organizationID : req.userData.organizationID
                }
            }).then((result)=>{
                fetchedRow = result.dataValues;
            });
           res.status(200).json({
               message : 'settings fetched successfully',
               body : fetchedRow
           });
        }
        else{
            res.status(400).json({
                message : 'You are not authorized to perform this action'
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

exports.updateSettings = async (req , res , next) => {
    try {
        if(req.userData.isAdmin){
            await settings.update(
                req.body ,
                {
                    where:{
                        organizationID : req.userData.organizationID
                    }
            }).then((result)=>{
                fetchedRow = result.dataValues;
            });
            res.status(200).json({
                message : 'settings updated successfully',
                body :{}
            });
        }
        else{
            res.status(400).json({
                message : 'You are not authorized to perform this action'
            });
        }
    }
    catch (error){
        console.log(error); 
        res.status(500).json({
            message : 'Something went wrong, plesae try again later'
        }) ; 
    }
  
}
