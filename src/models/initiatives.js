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
    }
});
Initiatives.belongsTo(Objectives); // Adds organizations to user rather than organizationsID
Objectives.hasMany(Initiatives);
module.exports = Initiatives; 