const  Sequelize  = require('sequelize');
const Org = sequelize.define('organization',{
    ID:{
        type : Sequelize.UUID ,
        primaryKey: true,
        allowNull : false 
    },
    OrgainzationName:{
        type : Sequelize.STRING
    }
});

module.exports = Org; 