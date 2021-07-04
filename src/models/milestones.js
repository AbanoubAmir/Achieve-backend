const  Sequelize  = require('sequelize');
const  Initiatives  = require('../models/initiatives');
const Milestones = sequelize.define('milestones',{
    ID:{
        type : Sequelize.UUID ,
        primaryKey: true,
        allowNull : false 
    },
    MilestoneName:{
        type : Sequelize.STRING
    },
    MeasurementUnit:{
        type : Sequelize.INTEGER
    },
    StartDate:{
        type : Sequelize.DATE
    },
    EndDate:{
        type : Sequelize.DATE
    },
    PlannedProgress:{
        type:Sequelize.INTEGER  
    }, 
    ActualValue:{
        type:Sequelize.INTEGER
    },
    Progress:{
        type:Sequelize.INTEGER
    } , 
    PlannedBudget:{
        type:Sequelize.INTEGER
    },
    ApprovedBudget:{
        type:Sequelize.INTEGER
    } , 
    SpentBudget:{
        type:Sequelize.INTEGER
    } 
});
Milestones.belongsTo(Initiatives, {as: 'Parent'}); // Adds organizations to user rather than organizationsID
module.exports = Milestones;