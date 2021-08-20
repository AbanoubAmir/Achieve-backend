const Sequelize  = require('sequelize');
const departments = require('./departments');
const Sub = sequelize.define('sub_department',{
    ID:{
        type : Sequelize.UUID ,
        primaryKey: true  ,
        allowNull : false ,   
        defaultValue: Sequelize.UUIDV4,
    },
    subDepartmentName:{
        type : Sequelize.STRING
    }
});
Sub.belongsTo(departments);
departments.hasMany(Sub);
module.exports = Sub; 