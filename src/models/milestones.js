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
        type:Sequelize.INTEGER,
        defaultValue: '0'
    }, 
    PlannedBudget:{
        type:Sequelize.INTEGER,
        defaultValue: '0'
    },
    ApprovedBudget:{
        type:Sequelize.INTEGER,
        defaultValue: '0'
    } , 
    SpentBudget:{
        type:Sequelize.INTEGER,
        defaultValue: '0'
    } 
});
Milestones.belongsTo(Initiatives); // Adds organizations to user rather than organizationsID
Initiatives.hasMany(Milestones); // Adds organizations to user rather than organizationsID

module.exports = Milestones;