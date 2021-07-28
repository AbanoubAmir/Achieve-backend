const Sequelize = require('sequelize') ; 
const sequelize = new Sequelize('achieve' , 'achieveAdmin@achieve-db' , 'Al_Ahly74', {
    host:'achieve-db.mysql.database.azure.com',
    dialect : 'mysql',
}); 

// sequelize.sync() ;

module.exports = sequelize; 

global.sequelize = sequelize;   

  