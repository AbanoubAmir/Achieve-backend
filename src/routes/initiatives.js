//importing needed packs 
const router = require('express').Router() ;
const initController = require('../controllers/initiatives'); 
const validateToken = require('../middleware/validate-token');
router.get('', initController.getInit); 
// router.get('/getProfile',validateToken, initController.getProfile); 

module.exports = router;