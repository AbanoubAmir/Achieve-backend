const  Sequelize  = require('sequelize');
const  prespectives  = require('../models/prespectives');
const Goals = sequelize.define('goal',{
    ID:{
        type : Sequelize.UUID ,
        primaryKey: true,
        allowNull : false 
    },
    GoalName:{
        type : Sequelize.STRING
    }
});
Goals.belongsTo(prespectives, {as: 'Parent'}); // Adds organizations to user rather than organizationsID

module.exports = Goals; 