//import needed packs
const Sequelize  = require('sequelize');
const common = require('../shared/commonMethods');

//import needed models 
const milestones = require('../models/milestones');
const milestone_progress = require('../models/progress');
const sequelize = require('../config/database');

exports.updateMilestoneProgressExpenses = async (req , res , next) => {

    let fetchedRow = [] , milestone = {}; 
    let month =  new Date().getMonth() + 1 , year = new Date().getFullYear(); 
    await milestones.findOne({
        attributes: ['ID', 'ApprovedBudget' , 'PlannedProgress' , 'PlannedBudget'] ,
        where:{
            ID : req.params.id
        }
    }).then((milestoneValue)=>{
        milestone = milestoneValue.dataValues ; 
    });
    await milestone_progress.findAll(
      {
          attributes: ['ID', 'progress'],
          where:[
            sequelize.where(Sequelize.fn('MONTH' , Sequelize.col('progressDate')),month),
            sequelize.where(Sequelize.fn('YEAR'  , Sequelize.col('progressDate')),year),
             {
                milestoneID : req.params.id
              }
            ]
        }).then((milestoneProgress)=>{
        milestoneProgress.forEach(element => {
            fetchedRow.push(element.dataValues);
        });
    });
    let milestoneProgress = await updateMilestoneProgress(fetchedRow, req.body.ActualValue, milestone) ; 
    let milestoneBudget = await updateMilestoneBudget(req.body.SpentBudget , milestone) ; 
    if(milestoneProgress && milestoneBudget){
        res.status(200).json({
            message : 'milestone updated successfully',
            body : {}
        });
    }
    else {
        res.status(500).json({
            message : 'Something went wrong, plesae try again later'
        }) ; 
    }
}

//update milestone progress
updateMilestoneProgress = async (progress , updatedProgress , milestone)=>{
    let Updated = true ; 
    let month = new Date().getMonth() + 1; 
    let year  = new Date().getFullYear();
    try{
        if(progress.length) {
            await milestone_progress.update(
                {
                    progress : Math.ceil((updatedProgress/milestone.PlannedProgress) * 100 ) > milestone.PlannedProgress ?
                    milestone.PlannedProgress : Math.ceil((updatedProgress/milestone.PlannedProgress) * 100 )  ,
                },
                {
                where:[
                    sequelize.where(Sequelize.fn('MONTH' , Sequelize.col('progressDate')),month),
                    sequelize.where(Sequelize.fn('YEAR'  , Sequelize.col('progressDate')),year),
                    {
                        ID : progress[0].ID,
                    }
                ],
                returning: true,
                plain: true
                        
            });
        } 
        else{
           await milestone_progress.create({
                progress : Math.ceil((updatedProgress/milestone.PlannedProgress) * 100 ) > milestone.PlannedProgress ?
                milestone.PlannedProgress : Math.ceil((updatedProgress/milestone.PlannedProgress) * 100 )  ,
                progressDate : Date.now() , 
                milestoneID: milestone.ID
            }); 
        } 
        return Updated ; 
    }
    catch(error){
        console.log(error); 
        Updated = false;
        return Updated ; 
    }
}

//update milestone spent budget
updateMilestoneBudget = async (updatedBudget , milestone)=>{
    let Updated = true  ; 
    if(updatedBudget == 0 || updatedBudget == '' )
        return Updated ; 
    try{
        await milestones.update({
                SpentBudget : updatedBudget
            },{
            where:{ID : milestone.ID},
            returning: true,
            plain: true    
        });
        return Updated ; 
    }
    catch (error){
        console.log(error);
        Updated = false ; 
        return Updated ;
    }
    
}
