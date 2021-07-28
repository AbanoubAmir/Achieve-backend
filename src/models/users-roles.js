const  Sequelize  = require('sequelize');
const Roles = sequelize.define('role',{
    ID:{
        type : Sequelize.UUID ,
        primaryKey: true,
        allowNull : false ,
        defaultValue: Sequelize.UUIDV4, 
    },
    RoleName:{
        type : Sequelize.STRING
    },
    RoleNumber:{
        type:Sequelize.INTEGER,
    }
});
module.exports = Roles; 