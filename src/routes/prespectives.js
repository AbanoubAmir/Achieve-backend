const router = require('express').Router() ;
const presCtrl = require('../controllers/prespectives'); 
const validateToken = require('../middleware/validate-token');

router.get('/:id' , validateToken ,presCtrl.getDirectiveDetails) ;
module.exports = router;