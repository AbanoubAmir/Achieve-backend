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
const Initiatives = require('../models/initiatives');

exports.getDirectiveDetails = async (req , res , next)=>{
    let fetchedRow = {} ;
    let dateType =  req.userData.selectedType ; 
    let date =  req.userData.selectedDate ; 
    let month , year , limit = 4;
    let progressWhere = []; 
    if(dateType === 'Monthly'){
        date = common.getMonth(date);
        month = date[0] ; 
        year = date[1] ; 
        progressWhere = [
            sequelize.where(Sequelize.fn('MONTH' , Sequelize.col('progress.progressDate')), {[Sequelize.Op.lte] : month}),
            sequelize.where(Sequelize.fn('YEAR' , Sequelize.col('progress.progressDate')) , year)
        ]; 
     }
    if(dateType === 'Yearly'){
        year = date; 
        progressWhere = [
            sequelize.where(Sequelize.fn('YEAR' , Sequelize.col('progress.progressDate')) , year)
        ]; 
    }
    if(dateType === 'Quarterly'){
        date = common.getMonthQuarter(date);
        month = date[0] ; 
        year = date[1] ; 
        progressWhere = [
            sequelize.where(Sequelize.fn('MONTH' , Sequelize.col('progress.progressDate')), {[Sequelize.Op.or] : month}),
            sequelize.where(Sequelize.fn('YEAR' , Sequelize.col('progress.progressDate')) , year)
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
        body :  await calculateValues(fetchedRow , dateType)
    });
}

async function calculateValues (prespective , type){
    let pres = [],
    goalss = [] ,
    objs = []  ,
    inits = []; 
    let response  = {
        ID : prespective.ID ,
        PerspectiveName : prespective.PerspectiveName,
        goals : []
    };
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
                                        let label  = '' ;
                                        if(type === 'Monthly')
                                            label = `${progress.progressDate.toString().substring(4,7)}-${progress.progressDate.toString().substring(11,15)}`;
                                        if(type === 'Yearly')
                                            label = progress.progressDate.toString().substring(11,15);
                                        if(type === 'Quarterly')
                                            label = `${progress.progressDate.toString().substring(4,7)}-${progress.progressDate.toString().substring(11,15)}`;
                                        if(typeof inits[i] === 'undefined')
                                            inits.push({'label' : label , 'progress' : progress.progress}); 
                                        else
                                            inits[i].progress += progress.progress ; 
                                    });
                                }
                            });
                            //calculate initiative progresses
                            inits.forEach((initiative , i) => {
                                initiative.progress = Math.ceil((initiative.progress / (init.milestones.length * 100)) * 100) ; 
                                initiative.color = common.assignColor(initiative.progress);
                                if(typeof objs[i] === 'undefined')
                                    objs.push({'label' : initiative.label , 'progress' : initiative.progress}); 
                                 else
                                 objs[i].progress += initiative.progress ; 
                            });
                        }
                        response.goals[goalIndex].objectives[objectIndex].initiatives[initIndex]['Progress'] = inits ; 
                        inits = [];
                    });
                    //calculate objectives progresses
                    objs.forEach((objective , i) => {
                        objective.progress = Math.ceil((objective.progress / (obj.initiatives.length * 100)) * 100) ; 
                        objective.color = common.assignColor(objective.progress); 
                        if(typeof goalss[i] === 'undefined')
                         goalss.push({'label' : objective.label , 'progress' : objective.progress}); 
                         else
                         goalss[i].progress += objective.progress ; 
                    });
                }
                response.goals[goalIndex].objectives[objectIndex]['Progress'] = objs ; 
                objs = [];
            }); 
            //calculate goals progresses
            goalss.forEach((goal , i) => {
                goal.progress = Math.ceil((goal.progress / (ele.objectives.length * 100)) * 100) ; 
                goal.color = common.assignColor(goal.progress);
                if(typeof pres[i] === 'undefined')
                pres.push({'label' : goal.label , 'progress' : goal.progress}); 
                 else
                 pres[i].progress += goal.progress ; 
            });
        }
        response.goals[goalIndex]['Progress'] = goalss ;       
        goalss = [];
    });
    // calculate directive progresses 
    pres.forEach((pre , i) => {
        pre.progress = Math.ceil((pre.progress / (prespective.goals.length * 100)) * 100) ; 
        pre.color = common.assignColor(pre.progress);
    });
    response['Progress'] = pres ; 
    return response;
}