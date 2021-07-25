const  Sequelize  = require('sequelize');
const Users = sequelize.define('user',{
    ID:{
        type : Sequelize.UUID ,
        primaryKey: true,
        allowNull : false 
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
});

module.exports = Users; 