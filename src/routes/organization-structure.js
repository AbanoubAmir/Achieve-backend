const router = require('express').Router() ;
const orgCtrl = require('../controllers/organization-structure'); 
const validateToken = require('../middleware/validate-token');

router.get('' ,validateToken,orgCtrl.getOrganizationsStrucutre) ;

module.exports = router;