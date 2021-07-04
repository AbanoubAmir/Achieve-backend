const Sequelize = require('sequelize') ; 
const sequelize = new Sequelize('achieve' , 'root' , 'Al_Ahly74', {
    host:'localhost',
    dialect : 'mysql',
    operatorsAliases:false
}); 
sequelize.sync() ;

module.exports = sequelize; 
global.sequelize = sequelize; 