//import needed models
const prespectives = require('../models/prespectives'); 
const goals = require('../models/goals'); 
const objectives = require('../models/objectives');
const initiatives = require('../models/initiatives');
const common = require('../shared/commonMethods');
exports.getDashboard = async (req , res , next) => {
    try{
        let fetchedRows = [] ; 
        //list all the prespectives
        await prespectives.findAll({attributes: ['ID', 'PerspectiveName' , 'Progress']}).then((prespectives)=>{
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
                attributes: ['ID', 'GoalName' , 'Progress']
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
                    attributes: ['ID', 'ObjectiveName', 'Progress']
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
                    attributes: ['ID', 'InitiativeName', 'Progress']
                }).then((initiatives)=>{
                    obj['Initiatives'] = [] ; 
                    initiatives.forEach(ele => {
                        obj['Initiatives'].push(ele.dataValues);
                    }); 
                });
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
        let goals = 0 ,objs = 0 , inits = 0 ; 
        if(ele.Goals.length){
            ele.Goals.forEach(goal =>{
                goals+=goal.Progress;
                if(goal.Objectives.length){
                    goal.Objectives.forEach(obj => {
                        objs+=obj.Progress;
                        if(obj.Initiatives.length){
                            obj.Initiatives.forEach(init =>{
                                inits+=init.Progress;
                            });
                            inits = Math.ceil((inits / (obj.Initiatives.length * 100)) * 100);
                        }
                    });
                    objs = Math.ceil((objs / (goal.Objectives.length * 100)) * 100);
                }
            }); 
            goals =Math.ceil((goals / (ele.Goals.length * 100) ) * 100);
        }
        response.push({
            DirectiveID : ele.ID ,
            DirectiveName : ele.PerspectiveName,
            DirectiveProgress : ele.Progress,
            DirectiveColor : common.assignColor(ele.Progress) ,
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