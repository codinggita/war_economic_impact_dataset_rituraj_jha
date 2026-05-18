const express = require('express');
const router = express.Router();
const rc = require('../controllers/recordController');

// POST routes
router.post('/regions', rc.createRecord('Region'));
router.post('/countries', rc.createRecord('Country'));
router.post('/economic-records', rc.createRecord('EconomicRecord'));
router.post('/poverty-records', rc.createRecord('PovertyRecord'));
router.post('/inflation-records', rc.createRecord('InflationRecord'));
router.post('/black-market-records', rc.createRecord('BlackMarketRecord'));
router.post('/war-cost-records', rc.createRecord('WarCostRecord'));
router.post('/reconstruction-records', rc.createRecord('ReconstructionRecord'));
router.post('/unemployment-records', rc.createRecord('UnemploymentRecord'));

// PUT / PATCH routes
router.put('/countries/:countryId', rc.updateRecord('Country'));
router.put('/economic-records/:recordId', rc.updateRecord('EconomicRecord'));
router.put('/reconstruction-records/:recordId', rc.updateRecord('ReconstructionRecord'));

// DELETE routes
router.delete('/countries/:countryId', rc.deleteRecord('Country'));
router.delete('/regions/:regionId', rc.deleteRecord('Region'));
router.delete('/economic-records/:recordId', rc.deleteRecord('EconomicRecord'));
router.delete('/poverty-records/:recordId', rc.deleteRecord('PovertyRecord'));
router.delete('/black-market-records/:recordId', rc.deleteRecord('BlackMarketRecord'));
router.delete('/war-cost-records/:recordId', rc.deleteRecord('WarCostRecord'));
router.delete('/reconstruction-records/:recordId', rc.deleteRecord('ReconstructionRecord'));
router.delete('/inflation-records/:recordId', rc.deleteRecord('InflationRecord'));
router.delete('/unemployment-records/:recordId', rc.deleteRecord('UnemploymentRecord'));

module.exports = router;
