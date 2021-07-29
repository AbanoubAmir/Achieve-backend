//import needed models
const organizations = require('../models/organizations'); 
const departments = require('../models/departments'); 
const sub_departments = require('../models/sub-departments');

exports.getOrganizationsStrucutre = async (req , res , next) => {
 try{
    let fetchedRows = [] ; 
    //list all the organizations
    await organizations.findAll({
        attributes: ['ID', 'OrgainzationName'],
        include:[{model:departments , include:[sub_departments]}]
    }).then((organizations)=>{
        organizations.forEach(ele => {
            fetchedRows.push(ele.dataValues);
        }); 
    });
    res.status(200).json({
        message : 'Organizations Structre fetched successfully',
        Body : fetchedRows
    }); 
 }
 catch (error){
    console.log(error);
    res.status(500).json({
        message : 'Something went wrong, plesae try again later'
    }) ; 
 }
}

   
