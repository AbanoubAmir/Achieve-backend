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
    isResetPassword : {
        type : Sequelize.BOOLEAN
    }
});
Users.belongsTo(organizations); // Adds organizations to user rather than organizationsID
organizations.hasMany(Users);
module.exports = Users; 