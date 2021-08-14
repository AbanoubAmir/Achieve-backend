const  Sequelize  = require('sequelize');
const milestones = require('./milestones');
const Pro = sequelize.define('progress',{
    ID:{
        type : Sequelize.UUID ,
        primaryKey: true  ,
        allowNull : false ,   
        defaultValue: Sequelize.UUIDV4,
    },
    progress:{
        type:Sequelize.INTEGER,
        defaultValue: '0'
    } , 
    progressDate:{
        type : Sequelize.DATE
    } 
});
Pro.belongsTo(milestones);
milestones.hasMany(Pro);
module.exports = Pro; 