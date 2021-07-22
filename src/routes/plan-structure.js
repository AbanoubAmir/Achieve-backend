const router = require('express').Router() ;
const planCtrl = require('../controllers/plan-structure'); 
const validateToken = require('../middleware/validate-token');

router.get('' ,planCtrl.getPlanStrucutre) ;

module.exports = router;