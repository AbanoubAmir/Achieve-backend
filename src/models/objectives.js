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
    },
    Progress:{
        type:Sequelize.INTEGER,
        defaultValue: '0'
    }
});
Objectives.belongsTo(Goals, {as: 'Parent'}); // Adds organizations to user rather than organizationsID

module.exports = Objectives; 