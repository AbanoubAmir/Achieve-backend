//importing needed packs 
const router = require('express').Router() ;
const dataControlController = require('../controllers/dataControl'); 
const validateToken = require('../middleware/validate-token');
router.get('', dataControlController.DataIntegration); 

module.exports = router;