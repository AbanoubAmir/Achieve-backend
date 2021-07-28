//import needed models
const prespectives = require('../models/prespectives'); 
const goals = require('../models/goals'); 
const objectives = require('../models/objectives');

exports.getPlanStrucutre = async (req , res , next) => {

 try{
    let fetchedRows = [] ; 
    //list all the prespectives
    await prespectives.findAll({attributes: ['ID', 'PerspectiveName']}).then((prespectives)=>{
        prespectives.forEach(ele => {
            fetchedRows.push(ele.dataValues);
        }); 
    });
    // list all the goals 
    for(let row of fetchedRows){
       await goals.findAll({
            where: {
                ParentID: row.ID 
            },
            attributes: ['ID', 'GoalName']
        }).then((goals)=>{
            row['Goals'] = [] ; 
            goals.forEach(ele => {
                row['Goals'].push(ele.dataValues);
            }); 
        });
    };
    //list all the objectives
    for(let row of fetchedRows){
        for(let goal of row['Goals']){
            await objectives.findAll({
                where: {
                    ParentID: goal.ID 
                },
                attributes: ['ID', 'ObjectiveName']
            }).then((objectives)=>{
                goal['Objectives'] = [] ; 
                objectives.forEach(ele => {
                    goal['Objectives'].push(ele.dataValues);
                }); 
            });
        }
      
    };
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
