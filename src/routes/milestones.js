//importing needed packs 
const router = require('express').Router() ;
const milestoneController = require('../controllers/milestones'); 
const validateToken = require('../middleware/validate-token');

router.put('/:id',validateToken, milestoneController.updateMilestoneProgressExpenses); 

module.exports = router;