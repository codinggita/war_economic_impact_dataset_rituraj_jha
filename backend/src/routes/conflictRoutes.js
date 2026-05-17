const express = require('express');
const router = express.Router();
const conflictController = require('../controllers/conflictController');

router.route('/')
  .get(conflictController.getConflicts)
  .post(conflictController.createConflict);

router.route('/:id')
  .get(conflictController.getConflictById)
  .put(conflictController.updateConflict)
  .patch(conflictController.patchConflict)
  .delete(conflictController.deleteConflict);

module.exports = router;
