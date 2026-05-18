const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const { adminLimiter } = require('../middlewares/rateLimiter');
const conflictController = require('../controllers/conflictController');

router.use(protect, admin, adminLimiter);

router.get('/dashboard', (req, res) => res.json({ message: 'Admin dashboard' }));
router.get('/conflicts', conflictController.getConflicts);
router.post('/conflicts', conflictController.createConflict);
router.patch('/conflicts/:id', conflictController.patchConflict);
router.delete('/conflicts/:id', conflictController.deleteConflict);

module.exports = router;
