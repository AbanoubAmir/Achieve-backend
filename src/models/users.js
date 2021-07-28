const  Sequelize  = require('sequelize');
const  organizations  = require('../models/organizations');
const Users = sequelize.define('user',{
    ID:{
        type : Sequelize.UUID ,
        primaryKey: true,
        allowNull : false ,
        defaultValue: Sequelize.UUIDV4,
    },
    username:{
        type : Sequelize.STRING
    },
    firstname:{
        type : Sequelize.STRING
    },
    lastname:{
        type : Sequelize.STRING
    },
    password:{
        type : Sequelize.STRING
    },
    email:{
        type : Sequelize.STRING
    },
    isAdmin:{
        type : Sequelize.BOOLEAN
    },
    role:{
        type : Sequelize.INTEGER
    },
    isActive : {
        type : Sequelize.BOOLEAN
    },
    ParentID :{
        type : Sequelize.STRING
    }
});

module.exports = Users; 