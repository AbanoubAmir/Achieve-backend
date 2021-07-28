//import needed models
const prespectives = require('../models/prespectives'); 
const goals = require('../models/goals'); 
const objectives = require('../models/objectives');
const initiatives = require('../models/initiatives');
const milestones = require('../models/milestones');

const common = require('../shared/commonMethods');

exports.getDashboard = async (req , res , next) => {
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
        //list all the initiatives
        for(let row of fetchedRows){
           for(let goal of row['Goals']){
            for(let obj of goal['Objectives']){
                await initiatives.findAll({
                    where: {
                        ParentID: obj.ID 
                    },
                    attributes: ['ID', 'InitiativeName']
                }).then((initiatives)=>{
                    obj['Initiatives'] = [] ; 
                    initiatives.forEach(ele => {
                        obj['Initiatives'].push(ele.dataValues);
                    }); 
                });
            }
          }
        };
        //list all the milestones
        for(let row of fetchedRows){
            for(let goal of row['Goals']){
             for(let obj of goal['Objectives']){
                for(let init of obj['Initiatives']){
                 await milestones.findAll({
                     where: {
                         ParentID: init.ID 
                     },
                     attributes: ['ID' , 'Progress']
                 }).then((milestones)=>{
                    init['Milestones'] = [] ; 
                    milestones.forEach(ele => {
                        init['Milestones'].push(ele.dataValues);
                     }); 
                 });
                }
             }
           }
         };
         
        res.status(200).json({
            message : 'Dashboard fetched successfully',
            Body : await calculateValues(fetchedRows)
        }); 
     }
     catch (error){
        console.log(error);
        res.status(500).json({
            message : 'Something went wrong, plesae try again later'
        }) ; 
     }
}
calculateValues = async (fetchedRows) => {
    let response = []; 
    fetchedRows.forEach(ele => {
        let pres = 0 , goals = 0 ,objs = 0 , inits = 0 ; 
        if(ele.Goals.length){
            ele.Goals.forEach(goal =>{
                if(goal.Objectives.length){
                    goal.Objectives.forEach(obj => {
                        if(obj.Initiatives.length){
                            obj.Initiatives.forEach(init =>{
                                let milestone = 0;
                                if(init.Milestones.length){
                                    init.Milestones.forEach(mile =>{
                                        milestone+=mile.Progress;
                                    });
                                    milestone = Math.ceil((milestone / (init.Milestones.length * 100)) * 100);
                                    init['Progress'] = milestone;
                                }
                                inits+=init.Progress;
                            });
                            inits = Math.ceil((inits / (obj.Initiatives.length * 100)) * 100);
                        }
                        objs+=inits;
                    });
                    objs = Math.ceil((objs / (goal.Objectives.length * 100)) * 100);
                }
                goals+=objs;
            }); 
            goals =Math.ceil((goals / (ele.Goals.length * 100) ) * 100);
            pres += goals; 
        }
        pres = Math.ceil((pres / (fetchedRows.length * 100)) * 100 ); 
        response.push({
            DirectiveID : ele.ID ,
            DirectiveName : ele.PerspectiveName,
            DirectiveProgress : pres,
            DirectiveColor : common.assignColor(pres) ,
            GoalsProgress : goals ,
            GoalsColor : common.assignColor(goals) , 
            ObjectivesProgress : objs, 
            ObjectivesColor : common.assignColor(objs),
            InitiativesProgress: inits , 
            InitiativesColor : common.assignColor(inits)
        });
    });
    return response;
}