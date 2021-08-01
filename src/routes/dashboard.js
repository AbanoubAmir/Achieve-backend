const router = require('express').Router() ;
const dashboardCtrl = require('../controllers/dashboard'); 
const validateToken = require('../middleware/validate-token');

router.get('' ,validateToken, dashboardCtrl.getDashboard) ;

module.exports = router;