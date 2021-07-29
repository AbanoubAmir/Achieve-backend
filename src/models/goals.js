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
Goals.belongsTo(prespectives); // Adds organizations to user rather than organizationsID
prespectives.hasMany(Goals);
module.exports = Goals; 