const router = require('express').Router() ;
const planCtrl = require('../controllers/plan-structure'); 
const validateToken = require('../middleware/validate-token');

router.get('' ,validateToken,planCtrl.getPlanStrucutre) ;

module.exports = router;