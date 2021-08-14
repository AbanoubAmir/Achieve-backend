const router = require('express').Router() ;
const userCtrl = require('../controllers/users'); 
const validateToken = require('../middleware/validate-token');

router.get('/getSettings' , validateToken, userCtrl.getSettings) ;
router.post('/updateSettings' ,validateToken, userCtrl.updateSettings) ;

module.exports = router;