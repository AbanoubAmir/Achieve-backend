const router = require('express').Router() ;
const settingsCtrl = require('../controllers/settings'); 
const validateToken = require('../middleware/validate-token');

router.get('' ,validateToken, settingsCtrl.getSettings) ;
router.put('' ,validateToken, settingsCtrl.updateSettings) ;


module.exports = router;