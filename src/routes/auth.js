//importing needed packs 
const router = require('express').Router() ;
const authController = require('../controllers/auth'); 
const validateToken = require('../middleware/validate-token');
router.post('/login', authController.login); 
router.post('/forget-password', authController.forgetPassword);
router.post('/change-password', validateToken, authController.changePassword); 
router.get('/getProfile',validateToken, authController.getProfile); 

module.exports = router;