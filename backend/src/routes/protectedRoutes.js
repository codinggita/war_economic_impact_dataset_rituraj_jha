const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const conflictController = require('../controllers/conflictController');

router.use(protect);

router.get('/conflicts', conflictController.getConflicts);
router.post('/conflicts', conflictController.createConflict);
router.delete('/conflicts/:id', conflictController.deleteConflict);

module.exports = router;
