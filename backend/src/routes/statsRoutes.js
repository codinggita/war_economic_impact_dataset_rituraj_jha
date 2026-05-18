const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/total-conflicts', statsController.getTotalConflicts);
router.get('/ongoing-conflicts', statsController.getOngoingConflicts);
router.get('/resolved-conflicts', statsController.getResolvedConflicts);
router.get('/highest-inflation', statsController.getHighestInflation);
router.get('/lowest-gdp', statsController.getLowestGdp);
router.get('/highest-poverty', statsController.getHighestPoverty);
router.get('/highest-food-insecurity', statsController.getHighestFoodInsecurity);
router.get('/highest-currency-gap', statsController.getHighestCurrencyGap);
router.get('/highest-war-cost', statsController.getHighestWarCost);
router.get('/highest-reconstruction-cost', statsController.getHighestReconstructionCost);

module.exports = router;
