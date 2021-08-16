//import needed packs
const  Sequelize  = require('sequelize');
const common = require('../shared/commonMethods');

//import needed models 
const prespectives = require('../models/prespectives');
const goals = require('../models/goals');
const objectives = require('../models/objectives');
const initiatives = require('../models/initiatives');
const milestones = require('../models/milestones');
const milestone_progress = require('../models/progress');
const sequelize = require('../config/database');

exports.getDirectiveDetails = async (req , res , next)=>{
    let fetchedRow = {} ;
    let dateType =  req.userData.selectedType ; 
    let date =  req.userData.selectedDate ; 
    let orignalDate = req.userData.selectedDate ; 
    let month , year , limit = 4;
    let progressWhere = []; 
    if(dateType === 'Monthly'){
        date = common.getDate(date , dateType);
        month = date[0] ; 
        year = date[1] ; 
        progressWhere = [
            sequelize.where(Sequelize.fn('MONTH' , Sequelize.col('progress.progressDate')), {[Sequelize.Op.lte] : month}),
        ]; 
     }
    if(dateType === 'Yearly'){
        year = date; 
        progressWhere = [
            sequelize.where(Sequelize.fn('YEAR' , Sequelize.col('progress.progressDate')) ,  {[Sequelize.Op.lte] : year})
        ]; 
    }
    if(dateType === 'Quarterly'){
        date = common.allQuarters(date);
        month = date[0] ; 
        year = date[1] ; 
        progressWhere = [
            sequelize.where(Sequelize.fn('MONTH' , Sequelize.col('progress.progressDate')), {[Sequelize.Op.or] : month}),
        ]; 
    }
      //list all the prespectives
    await prespectives.findOne(
        {
            attributes: ['ID', 'PerspectiveName'],
            where:{
                ID : req.params.id
            },
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
                                  where :progressWhere,
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
        fetchedRow = prespectives.dataValues ; 
    });
    res.status(200).json({
        message : 'Directive Details fetched successfully',
        body :  await calculateValues(fetchedRow ,orignalDate,  dateType , limit)
    });
}

async function calculateValues (prespective ,date ,  type , limit){
    let labels = common.getHistoricalLabels(date , type , limit);
    let pres = [],
    goalss = [] ,
    objs = []  ,
    inits = [],
    allInititaviessProgress = [];

    //initilization for progress holders 
    for(let i = 0 ;i<labels.length ; i++){
        pres.push({
            label:labels[i] ,
            progress : 0 
        }); 
        goalss.push({
            label:labels[i] ,
            progress : 0 
        }); 
        objs.push({
            label:labels[i] ,
            progress : 0 
        }); 
        inits.push({
            label:labels[i] ,
            progress : 0 
        }); 
        allInititaviessProgress.push({
            label:labels[i] ,
            progress : 0 
        }); 
    }
    
    let response  = {
        ID : prespective.ID ,
        PerspectiveName : prespective.PerspectiveName,
        goals : [],
        labels:labels.reverse()
    };
    let initiativesTotalCount = 0; 
    prespective.goals.forEach((ele , goalIndex)=> {
        response.goals.push({
            ID : ele.ID,
            GoalName : ele.GoalName,
            objectives : []
        }); 
        if(ele.objectives.length){
            ele.objectives.forEach((obj , objectIndex) =>{
                response.goals[goalIndex].objectives.push({
                    ID : obj.ID ,
                    ObjectiveName:obj.ObjectiveName,
                    initiatives : []
                });
                if(obj.initiatives.length){
                    obj.initiatives.forEach((init , initIndex) => {
                        response.goals[goalIndex].objectives[objectIndex].initiatives.push({
                            ID : init.ID,
                            InitiativeName : init.InitiativeName
                        })
                        if(init.milestones.length){
                            init.milestones.forEach(milestone =>{
                                if(milestone.progresses.length){
                                    milestone.progresses.forEach((progress , i) => {
                                        inits[i].progress += progress.progress ; 
                                    });
                                }
                            });
                            //calculate initiative progresses
                            inits.forEach((initiative , i) => {
                                initiative.progress = Math.ceil((initiative.progress / (init.milestones.length * 100)) * 100) ; 
                                initiative.color = common.assignColor(initiative.progress);
                                objs[i].progress += initiative.progress ; 
                            });
                        }
                        response.goals[goalIndex].objectives[objectIndex].initiatives[initIndex]['Progress'] = inits.reverse() ; 
                        inits.forEach((ini , i) => {
                            allInititaviessProgress[i].progress += ini.progress;
                        });
                        inits = [] ;
                        for(let i = 0 ;i<labels.length ; i++){
                            inits.push({
                                label:labels[i] ,
                                progress : 0 
                            }); 
                        }
                    });
                    //calculate objectives progresses
                    objs.forEach((objective , i) => {
                        objective.progress = Math.ceil((objective.progress / (obj.initiatives.length * 100)) * 100) ; 
                        objective.color = common.assignColor(objective.progress); 
                        goalss[i].progress += objective.progress ; 
                    });
                    initiativesTotalCount+=obj.initiatives.length ; 
                }
                response.goals[goalIndex].objectives[objectIndex]['Progress'] = objs.reverse() ; 
                objs = [];
                for(let i = 0 ;i<labels.length ; i++){
                    objs.push({
                        label:labels[i] ,
                        progress : 0 
                    }); 
                }
            }); 
            //calculate goals progresses
            goalss.forEach((goal , i) => {
                goal.progress = Math.ceil((goal.progress / (ele.objectives.length * 100)) * 100) ; 
                goal.color = common.assignColor(goal.progress);
                pres[i].progress += goal.progress ; 
            });
        }
        response.goals[goalIndex]['Progress'] = goalss.reverse() ;       
        goalss=[];
        for(let i = 0 ;i<labels.length ; i++){
            goalss.push({
                label:labels[i] ,
                progress : 0 
            }); 
        }
    });
    // calculate directive progresses 
    pres.forEach((pre , i) => {
        pre.progress = Math.ceil((pre.progress / (prespective.goals.length * 100)) * 100) ; 
        pre.color = common.assignColor(pre.progress);
    });
    allInititaviessProgress.forEach(ele =>{
        ele.progress = Math.ceil((ele.progress / (initiativesTotalCount * 100)) * 100) ; 
    }) ;
    response['InititaviesProgress'] = allInititaviessProgress; 
    response['Progress'] = pres.reverse();       
    return response;
}