const  Sequelize  = require('sequelize');
const  Goals  = require('../models/goals');
const Objectives = sequelize.define('objective',{
    ID:{
        type : Sequelize.UUID ,
        primaryKey: true,
        allowNull : false 
    },
    ObjectiveName:{
        type : Sequelize.STRING
    }
});
Objectives.belongsTo(Goals); // Adds organizations to user rather than organizationsID
Goals.hasMany(Goals); // Adds organizations to user rather than organizationsID

module.exports = Objectives; 