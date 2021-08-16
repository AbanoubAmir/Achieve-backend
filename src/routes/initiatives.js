//importing needed packs 
const router = require('express').Router() ;
const initController = require('../controllers/initiatives'); 
const validateToken = require('../middleware/validate-token');

router.get('',validateToken, initController.getInitiatives); 
router.get('/:id',validateToken, initController.getInitiativeDetails); 

module.exports = router;