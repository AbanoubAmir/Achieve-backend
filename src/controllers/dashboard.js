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



exports.getDashboard = async (req , res , next) => {
    try{
        let fetchedRows = [] ; 
        console.log(req.headers);
        let dateType =  req.headers.selectedtype ; 
        let date =  req.headers.selecteddate ; 
        let month , year , limit = await common.getLimit(req.userData.organizationID);
        date = await common.getDate(date , dateType , req.userData.organizationID);
        month = date[0] ; 
        year = date[1] ; 

        //list all the prespectives
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
        let Totalgoals = 0 ,Totalobjs = 0 , Totalinits = 0 ;
        let TotalobjsCount = 0 , TotalinitsCount = 0 ;
        if(ele.goals.length){
            ele.goals.forEach(goal =>{
                objs = 0 ; 
                if(goal.objectives.length){
                    goal.objectives.forEach(obj => {
                        inits = 0 ;
                        if(obj.initiatives.length){
                            obj.initiatives.forEach(init =>{
                                let milestone = 0;
                                if(init.milestones.length){
                                    init.milestones.forEach(mile =>{
                                        mile.progresses.forEach((progress) =>{
                                            milestone+=progress.progress;
                                        });
                                    });
                                    milestone = Math.ceil((milestone / (init.milestones.length * 100)) * 100);
                                    init['Progress'] = milestone;
                                }
                                inits+=init.Progress;
                                Totalinits+= init.Progress;    
                            });
                            objs+=Math.ceil((inits / (obj.initiatives.length * 100)) * 100);
                            Totalobjs+=Math.ceil((inits / (obj.initiatives.length * 100)) * 100);
                            TotalinitsCount+=obj.initiatives.length ; 
                        }
                    });
                    Totalgoals+=Math.ceil((objs / (goal.objectives.length * 100)) * 100) ; 
                    goals+=Math.ceil((objs / (goal.objectives.length * 100)) * 100);
                    TotalobjsCount+=goal.objectives.length;
                }
            }); 
            pres += Math.ceil((goals / (ele.goals.length * 100) ) * 100); 
        }
        Totalgoals = Math.ceil((Totalgoals / (ele.goals.length * 100) ) * 100) ; 
        Totalobjs = Math.ceil((Totalobjs / (TotalobjsCount * 100) ) * 100) ; 
        Totalinits = Math.ceil((Totalinits / (TotalinitsCount * 100) ) * 100) ; 
        
        response.push({
            DirectiveID : ele.ID ,
            DirectiveName : ele.PerspectiveName,
            DirectiveProgress : pres,
            DirectiveColor : common.assignColor(pres) ,
            GoalsProgress : Totalgoals ,
            GoalsColor : common.assignColor(Totalgoals) , 
            ObjectivesProgress : Totalobjs, 
            ObjectivesColor : common.assignColor(Totalobjs),
            InitiativesProgress: Totalinits , 
            InitiativesColor : common.assignColor(Totalinits)
        });
    });
    return response;
}