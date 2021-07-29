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
    }
});
Pres.belongsTo(organizations); // Adds organizations to user rather than organizationsID
organizations.hasMany(Pres);
module.exports = Pres; 