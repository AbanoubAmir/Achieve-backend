const  Sequelize  = require('sequelize');
const  Objectives  = require('../models/objectives');
const Initiatives = sequelize.define('initiative',{
    ID:{
        type : Sequelize.UUID ,
        primaryKey: true,
        allowNull : false 
    },
    InitiativeName:{
        type : Sequelize.STRING
    },
    Progress:{
        type:Sequelize.INTEGER,
        defaultValue: '0'
    }  
});
Initiatives.belongsTo(Objectives, {as: 'Parent'}); // Adds organizations to user rather than organizationsID
module.exports = Initiatives; 