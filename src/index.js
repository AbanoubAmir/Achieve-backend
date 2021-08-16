const express = require('express') ; 
const cors = require('cors');
require('express-async-errors'); 
require('dotenv').config({path:__dirname+'/.env'});
const app = express() ;
const port = process.env.PORT || 8000  ; 

//handeling cors
app.use(cors()); 

//database
const db = require('./config/database'); 
db.authenticate()
.then(()=> console.log('Database Connected!'))
.catch((e)=> console.log(e));

//express.json to manage the req content 
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb' , extended:true , parameterLimit:50000}));


//importing routes 
const authRoutes = require('./routes/auth'); 
const initRoutes = require('./routes/initiatives'); 
const dataControlRoutes = require('./routes/dataControl'); 
const plan_structureRoutes = require('./routes/plan-structure');
const organizations_structureRoutes = require('./routes/organization-structure');
const dashboardRoutes = require('./routes/dashboard');
const admindashboardRoutes = require('./routes/admindashboard');
const usersRoutes = require('./routes/users');
const prespectivesRoutes = require('./routes/prespectives');
const milestonesRoutes = require('./routes/milestones');

//make the app listen to port 8000
app.listen(port , ()=>{
    console.log(`app is listening port ${port}`);
});

//allow access control origin 
app.use((req, res, next) => {
  
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    res.setHeader('Access-Control-Allow-Methods', '*');
  
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
  
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    next();
    
  
});

//routing config
app.use('/api/auth',authRoutes); 
app.use('/api/initiatives',initRoutes); 
app.use('/api/dataControl',dataControlRoutes); 
app.use('/api/plan-structure',plan_structureRoutes); 
app.use('/api/organization-structure',organizations_structureRoutes); 
app.use('/api/dashboard',dashboardRoutes); 
app.use('/api/admindashboard',admindashboardRoutes); 
app.use('/api/users',usersRoutes); 
app.use('/api/prespectives',prespectivesRoutes); 
app.use('/api/milestones',milestonesRoutes); 

module.exports = app ;