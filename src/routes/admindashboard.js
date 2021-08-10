const router = require('express').Router() ;
const dashboardCtrl = require('../controllers/admindashboard'); 
const validateToken = require('../middleware/validate-token');

router.get('/:tablename' , validateToken, dashboardCtrl.getDashboard) ;
router.post('/:tablename' , validateToken, dashboardCtrl.postDashboard) ;
router.put('/:tablename' , validateToken, dashboardCtrl.putDashboard) ;
router.delete('/:tablename' , validateToken, dashboardCtrl.deleteDashboard) ;


module.exports = router;