//import needed packs
const Sequelize  = require('sequelize');
const common = require('../shared/commonMethods');

//import needed models 
const prespectives = require('../models/prespectives');
const goals = require('../models/goals');
const objectives = require('../models/objectives');
const initiatives = require('../models/initiatives');
const milestones = require('../models/milestones');
const milestone_progress = require('../models/progress');
const sequelize = require('../config/database');

exports.getInitiatives = async (req , res , next) =>{
  try{
    let fetchedRows = [] ;
    let dateType =  req.headers.selectedtype ; 
    let date =  req.headers.selecteddate ; 
    let month , year , limit = await common.getLimit(req.userData.organizationID);
    date = await common.getDate(date , dateType , req.userData.organizationID);
    month = date[0] ; 
    year = date[1] ; 
    await prespectives.findAll(
      {
          attributes: ['ID', 'PerspectiveName'],
          include:[{
              model:goals ,
              include:[{
                  model:objectives ,
                   include :[{
                       model:initiatives ,
                        include:[{
                            model : milestones ,
                             include:[{
                                model:milestone_progress,
                                where :[
                                sequelize.where(Sequelize.fn('MONTH' , Sequelize.col('progress.progressDate')),month),
                                sequelize.where(Sequelize.fn('YEAR' , Sequelize.col('progress.progressDate')) ,year)
                              ],
                                limit: limit,
                                order: [
                                  ['progressDate', 'DESC']
                                ]
                              }]
                        }]
                   }]
              }]
          }]
        }).then((prespectives)=>{
          prespectives.forEach(ele => {
            fetchedRows.push(ele.dataValues);
          }); 
    }); 
      res.status(200).json({
        message : 'Inititavies&Budgets fetched successfully',
        body : await getAllInitiatives(fetchedRows)
    }) ; 
  }
  catch(error){
    console.log(error);
    res.status(500).json({
        message : 'Something went wrong, plesae try again later'
    }) ; 
  }

    
  
}

exports.getInitiativeDetails = async (req , res , next) =>{
  try{
    let fetchedRow = {} ;
    let dateType =  req.headers.selectedtype ; 
    let date =  req.headers.selecteddate ; 
    let month , year , limit = await common.getLimit(req.userData.organizationID);
    date = await common.getDate(date , dateType , req.userData.organizationID);
    month = date[0] ; 
    year = date[1] ; 
    await initiatives.findOne(
      {
          attributes: ['ID', 'InitiativeName'],
          where:{
            ID : req.params.id
          },
          include:[{
            model : milestones ,
             include:[{
                model:milestone_progress,
                where :[
                sequelize.where(Sequelize.fn('MONTH' , Sequelize.col('progress.progressDate')),month),
                sequelize.where(Sequelize.fn('YEAR' , Sequelize.col('progress.progressDate')) ,year)
                ],
                limit: limit,
                order: [
                  ['progressDate', 'DESC']
                ]
             }]
          } , 
            {
              model : objectives ,
              include :[{
                model:goals,
                include:[{
                  model:prespectives
                }]
              }]
            }]
        }).then((initiative)=>{
            fetchedRow = initiative.dataValues;
     }); 
      res.status(200).json({
        message : 'Inititavies Details fetched successfully',
        body : await getInitiativeDetails(fetchedRow)
    }) ; 
  }
  catch(error){
    console.log(error);
    res.status(500).json({
        message : 'Something went wrong, plesae try again later'
    }) ; 
  }

    
  
}

async function getAllInitiatives(prespectives){
  let response = [] ;
  prespectives.forEach((pres , presIndex) =>{
    response.push({
      ID : pres.ID,
      PerspectiveName : pres.PerspectiveName,
      goals : []
   }); 
    pres.goals.forEach((goal, goalIndex)=>{
      response[presIndex].goals.push({
        ID : pres.ID,
        GoalName : goal.GoalName,
        objectives : []
      }); 
      goal.objectives.forEach((obj , objIndex) =>{
        response[presIndex].goals[goalIndex].objectives.push({
          ID : obj.ID,
          ObjectiveName : obj.ObjectiveName,
          initiatives : []
        }); 
          obj.initiatives.forEach((init , initIndex) =>{
            response[presIndex].goals[goalIndex].objectives[objIndex].initiatives.push({
              ID : init.ID,
              InitiativeName : init.InitiativeName
            });
            let initProgress = 0  , initBudget  = 0  , initSpentBudget = 0 ;
            let initStartDate = '9999-12-30'; 
            let initEndDate = '0000-01-01';  
            init.milestones.forEach((milestone , milestoneIndex) => {
              milestone.progresses.forEach((progress) =>{
                initProgress+=progress.progress;
              }); 
              if(new Date(initStartDate) > new Date(milestone.StartDate))
                initStartDate = milestone.StartDate.toISOString().substring(0,10);
              if(new Date (initEndDate) < new Date (milestone.EndDate))
                initEndDate = milestone.EndDate.toISOString().substring(0,10) ;
               initBudget += milestone.ApprovedBudget ; 
               initSpentBudget += milestone.SpentBudget ; 

            });
            response[presIndex].goals[goalIndex].objectives[objIndex].initiatives[initIndex]['Progress'] = Math.ceil((initProgress / (init.milestones.length  * 100)) * 100) ; 
            response[presIndex].goals[goalIndex].objectives[objIndex].initiatives[initIndex]['StartDate'] = initStartDate ; 
            response[presIndex].goals[goalIndex].objectives[objIndex].initiatives[initIndex]['EndDate'] = initEndDate ; 
            response[presIndex].goals[goalIndex].objectives[objIndex].initiatives[initIndex]['ApprovedBudget'] = initBudget ;
            response[presIndex].goals[goalIndex].objectives[objIndex].initiatives[initIndex]['SpentBudget'] =  initSpentBudget;
            response[presIndex].goals[goalIndex].objectives[objIndex].initiatives[initIndex]['Color'] = common.assignColor(response[presIndex].goals[goalIndex].objectives[objIndex].initiatives[initIndex]['Progress'] ) ; 
          });
      });
    });
  });
  return response; 
}

async function getInitiativeDetails(initiative){
   let response = {} ;
   response = {
      ID : initiative.ID,
      InitiativeName : initiative.InitiativeName,
      objective : initiative.objective , 
      milestones : []
   };   
   let initProgress = 0  , initBudget  = 0  , initSpentBudget = 0 ;
   let initStartDate = '9999-12-30'; 
   let initEndDate = '0000-01-01';  
   initiative.milestones.forEach((milestone , milestoneIndex) => {
        let milestoneProgress = 0 ; 
        response.milestones.push({
          ID : milestone.ID,
          MilestoneName:milestone.MilestoneName
        }) ; 
        milestone.progresses.forEach((progress) =>{
          milestoneProgress+=progress.progress;
        }); 
        if(new Date(initStartDate) > new Date(milestone.StartDate))
          initStartDate = milestone.StartDate.toISOString().substring(0,10);
        if(new Date (initEndDate) < new Date (milestone.EndDate))
          initEndDate = milestone.EndDate.toISOString().substring(0,10) ;
          initBudget += milestone.ApprovedBudget ; 
          initSpentBudget += milestone.SpentBudget ;
          response.milestones[milestoneIndex]['Progress'] = (milestoneProgress / (milestone.PlannedProgress) * 100) ;
          initProgress += response.milestones[milestoneIndex]['Progress'];
          response.milestones[milestoneIndex]['StartDate'] = milestone.StartDate.toISOString().substring(0,10) ; 
          response.milestones[milestoneIndex]['EndDate'] = milestone.EndDate.toISOString().substring(0,10) ; 
          response.milestones[milestoneIndex]['ApprovedBudget'] = milestone.ApprovedBudget ; 
          response.milestones[milestoneIndex]['SpentBudget'] = milestone.SpentBudget ; 
          response.milestones[milestoneIndex]['Color'] = common.assignColor(response.milestones[milestoneIndex]['Progress']) ; 
   });
  response['Progress'] = Math.ceil((initProgress / (initiative.milestones.length  * 100)) * 100) ; 
  response['StartDate'] = initStartDate ; 
  response['EndDate'] = initEndDate ; 
  response['ApprovedBudget'] = initBudget ; 
  response['SpentBudget'] = initSpentBudget ; 
  response['Color'] = common.assignColor(response['Progress'] ) ; 
  return response; 
}
