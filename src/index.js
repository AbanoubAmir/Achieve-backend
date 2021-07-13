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
.catch(()=> console.log('failed'));

//express.json to manage the req content 
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb' , extended:true , parameterLimit:50000}));


//importing routes 
const authRoutes = require('./routes/auth'); 
const initRoutes = require('./routes/initiatives'); 
const dataControlRoutes = require('./routes/dataControl'); 

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

module.exports = app ;