const  Sequelize  = require('sequelize');
const organizations = require('./organizations');
const Set = sequelize.define('setting',{
    ID:{
        type : Sequelize.UUID ,
        primaryKey: true  ,
        allowNull : false ,   
        defaultValue: Sequelize.UUIDV4,
    },
    limit:{
        type : Sequelize.INTEGER,
        allowNull : false ,   
        defaultValue: 4
    },
    firstQuarterStart:{
        type : Sequelize.STRING,
        allowNull : false ,   
        defaultValue: `Jan-${new Date().getFullYear()}`
    },
    firstQuarterEnd:{
        type : Sequelize.STRING,
        allowNull : false ,   
        defaultValue: `Mar-${new Date().getFullYear()}`
    },
    secondQuarterStart:{
        type : Sequelize.STRING,
        allowNull : false ,   
        defaultValue: `Apr-${new Date().getFullYear()}`
    },
    secondQuarterEnd:{
        type : Sequelize.STRING,
        allowNull : false ,   
        defaultValue: `Jun-${new Date().getFullYear()}`
    },
    thirdQuarterStart:{
        type : Sequelize.STRING,
        allowNull : false ,   
        defaultValue: `Jul-${new Date().getFullYear()}`
    },
    thirdQuarterEnd:{
        type : Sequelize.STRING,
        allowNull : false ,   
        defaultValue: `Sep-${new Date().getFullYear()}`
    },
    forthQuarterStart:{
        type : Sequelize.STRING,
        allowNull : false ,   
        defaultValue: `Oct-${new Date().getFullYear()}`
    },
    forthQuarterEnd:{
        type : Sequelize.STRING,
        allowNull : false ,   
        defaultValue: `Dec-${new Date().getFullYear()}`
    }
});
Set.belongsTo(organizations);
organizations.hasMany(Set);
module.exports = Set; 