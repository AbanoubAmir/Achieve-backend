//importing needed packs 
const router = require('express').Router() ;
const authController = require('../controllers/auth'); 
const validateToken = require('../middleware/validate-token');
router.post('/login', authController.login); 
router.get('/getProfile',validateToken, authController.getProfile); 

module.exports = router;