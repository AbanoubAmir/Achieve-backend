const  Sequelize  = require('sequelize');
const organizations = require('./organizations');
const Dep = sequelize.define('department',{
    ID:{
        type : Sequelize.UUID ,
        primaryKey: true  ,
        allowNull : false ,   
        defaultValue: Sequelize.UUIDV4,
    },
    DepartmentName:{
        type : Sequelize.STRING
    }
});
Dep.belongsTo(organizations);
organizations.hasMany(Dep);
module.exports = Dep; 