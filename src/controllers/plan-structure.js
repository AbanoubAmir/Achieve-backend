//import needed models
const prespectives = require('../models/prespectives'); 
const goals = require('../models/goals'); 
const objectives = require('../models/objectives');

exports.getPlanStrucutre = async (req , res , next) => {

 try{
    let fetchedRows = [] ; 
    //list all the prespectives
    await prespectives.findAll({
        attributes: ['ID', 'PerspectiveName'],
        include : [{model:goals , include : [objectives]}]
    }).then((prespectives)=>{
        prespectives.forEach(ele => {
            fetchedRows.push(ele.dataValues);
        }); 
    });
    res.status(200).json({
        message : 'Plan Structre fetched successfully',
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
