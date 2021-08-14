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
        await prespectives.findAll(
        {
            attributes: ['ID', 'PerspectiveName'],
            include:[{model:goals , include:[{model:objectives , include :[{model:initiatives , include:[milestones]}]}]}]
        }).then((prespectives)=>{
            prespectives.forEach(ele => {
                fetchedRows.push(ele.dataValues);
            }); 
        });
        res.status(200).json({
            message : 'Dashboard fetched successfully',
            body : await calculateValues(fetchedRows)
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
        if(ele.goals.length){
            ele.goals.forEach(goal =>{
                if(goal.objectives.length){
                    goal.objectives.forEach(obj => {
                        if(obj.initiatives.length){
                            obj.initiatives.forEach(init =>{
                                let milestone = 0;
                                if(init.milestones.length){
                                    init.milestones.forEach(mile =>{
                                        milestone+=mile.Progress;
                                    });
                                    milestone = Math.ceil((milestone / (init.milestones.length * 100)) * 100);
                                    init['Progress'] = milestone;
                                }
                                inits+=init.Progress;
                            });
                            inits = Math.ceil((inits / (obj.initiatives.length * 100)) * 100);
                        }
                        objs+=inits;
                    });
                    objs = Math.ceil((objs / (goal.objectives.length * 100)) * 100);
                }
                goals+=objs;
            }); 
            goals =Math.ceil((goals / (ele.goals.length * 100) ) * 100);
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