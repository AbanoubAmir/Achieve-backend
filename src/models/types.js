const  Sequelize  = require('sequelize');
const Types = sequelize.define('type',{
    ID:{
        type : Sequelize.UUID ,
        primaryKey: true,
        allowNull : false ,
        defaultValue: Sequelize.UUIDV4,
    },
    TypeName:{
        type : Sequelize.STRING
    },
    TypeNumber:{
        type:Sequelize.INTEGER,
    }
});
module.exports = Types; 