const  Sequelize  = require('sequelize');
const  organizations  = require('../models/organizations');
const Pres = sequelize.define('prespective',{
    ID:{
        type : Sequelize.UUID ,
        primaryKey: true,
        allowNull : false 
    },
    PerspectiveName:{
        type : Sequelize.STRING
    },
    Description:{
        type : Sequelize.STRING
    },
    Progress:{
        type:Sequelize.INTEGER,
        defaultValue: '0'
    }
});
Pres.belongsTo(organizations, {as: 'Parent'}); // Adds organizations to user rather than organizationsID

module.exports = Pres; 