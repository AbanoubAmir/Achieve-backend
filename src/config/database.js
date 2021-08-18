const Sequelize = require('sequelize') ; 
require('dotenv').config();
const sequelize = new Sequelize(process.env.AchieveDBSchemaProd , process.env.AchieveDBUser ,process.env.AchieveDBPassword, {
    host:process.env.AchieveDBUrl,
    dialect : 'mysql',
}); 

// sequelize.sync() ;
module.exports = sequelize; 

global.sequelize = sequelize;   
