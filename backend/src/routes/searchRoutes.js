const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/', searchController.globalSearch);
router.get('/conflicts', searchController.conflictSearch);
router.get('/economic', searchController.economicSearch);
router.get('/sector', searchController.sectorSearch);
router.get('/black-market', searchController.blackMarketSearch);

module.exports = router;
