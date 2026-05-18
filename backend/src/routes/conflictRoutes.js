const express = require('express');
const router = express.Router();
const conflictController = require('../controllers/conflictController');

// Advanced GET queries (pagination, sorting, filtering via query string)
router.route('/').get(conflictController.getConflicts).post(conflictController.createConflict);

// Top/Recent/Advanced specific static routes
router.get('/top/highest-inflation', conflictController.getTopConflicts('inflation', -1));
router.get('/top/highest-poverty', conflictController.getTopConflicts('poverty', -1));
router.get('/recent', conflictController.getTopConflicts('startYear', -1));
router.get('/latest', conflictController.getTopConflicts('startYear', -1));
// Random and Trending could be implemented similarly, here just aliasing for brevity
router.get('/random', conflictController.getConflicts);
router.get('/trending', conflictController.getConflicts);
router.get('/ongoing', (req, res, next) => { req.query.status = 'Ongoing'; next(); }, conflictController.getConflicts);
router.get('/resolved', (req, res, next) => { req.query.status = 'Resolved'; next(); }, conflictController.getConflicts);
router.get('/high-risk', (req, res, next) => { req.query.gdpLossAbove = 20; next(); }, conflictController.getConflicts);
router.get('/economic-collapse', (req, res, next) => { req.query.inflationAbove = 100; next(); }, conflictController.getConflicts);

// Additional aliases from Pagination section
router.get('/europe', (req, res, next) => { req.query.region = 'Europe'; next(); }, conflictController.getConflicts);
router.get('/asia', (req, res, next) => { req.query.region = 'Asia'; next(); }, conflictController.getConflicts);
router.get('/high-inflation', (req, res, next) => { req.query.inflationAbove = 50; next(); }, conflictController.getConflicts);
router.get('/high-poverty', (req, res, next) => { req.query.povertyAbove = 30; next(); }, conflictController.getConflicts);
router.get('/high-gdp-loss', (req, res, next) => { req.query.gdpLossAbove = 30; next(); }, conflictController.getConflicts);
router.get('/black-market/high', (req, res, next) => { req.query.blackMarket = 'High'; next(); }, conflictController.getConflicts);


// Parametric GET queries
router.get('/name/:name', conflictController.getByField('name'));
router.get('/type/:type', conflictController.getByField('type'));
router.get('/region/:region', conflictController.getByField('region'));
router.get('/status/:status', conflictController.getByField('status'));
router.get('/country/:country', conflictController.getByField('country'));
router.get('/start-year/:year', conflictController.getByField('startYear', true));
router.get('/end-year/:year', conflictController.getByField('endYear', true));
router.get('/inflation/:rate', conflictController.getByField('inflation', true));
router.get('/gdp-loss/:percentage', conflictController.getByField('gdpLoss', true));
router.get('/poverty/:rate', conflictController.getByField('poverty', true));
router.get('/extreme-poverty/:rate', conflictController.getByField('extremePoverty', true));
router.get('/food-insecurity/:rate', conflictController.getByField('foodInsecurity', true));
router.get('/unemployment/:rate', conflictController.getByField('unemployment', true));
router.get('/youth-unemployment/:rate', conflictController.getByField('youthUnemployment', true));
router.get('/sector/:sector', conflictController.getByField('sector'));
router.get('/black-market/:level', conflictController.getByField('blackMarket'));
router.get('/black-market-goods/:goods', conflictController.getByField('blackMarketGoods'));
router.get('/profiteering/:status', conflictController.getByField('profiteering'));
router.get('/currency-gap/:gap', conflictController.getByField('currencyGap', true));
router.get('/reconstruction-cost/:amount', conflictController.getByField('reconstructionCost', true));
router.get('/cost-of-war/:amount', conflictController.getByField('costOfWar', true));
router.get('/informal-economy/pre/:value', conflictController.getByField('informalEconomyPre', true));
router.get('/informal-economy/during/:value', conflictController.getByField('informalEconomyDuring', true));
router.get('/households/:count', conflictController.getByField('households', true));
router.get('/year/:year', (req, res, next) => { req.query.year = req.params.year; next(); }, conflictController.getConflicts);

// Complex parameter routes
router.get('/region/:region/latest', conflictController.getRegionLatest);
router.get('/region/:region/oldest', conflictController.getRegionOldest);
router.get('/country/:country/history', conflictController.getCountryHistory);
router.get('/type/:type/count', conflictController.getCountByField('type'));
router.get('/status/:status/count', conflictController.getCountByField('status'));
router.get('/sector/:sector/highest-gdp-loss', conflictController.getHighestBySector('gdpLoss', 1));
router.get('/sector/:sector/highest-inflation', conflictController.getHighestBySector('inflation', -1));

// War Summary Specific
router.get('/war/:name/summary', conflictController.getWarImpact(['name', 'type', 'region', 'status', 'startYear', 'endYear']));
router.get('/war/:name/economic-impact', conflictController.getWarImpact(['gdpLoss', 'inflation', 'sector']));
router.get('/war/:name/poverty-impact', conflictController.getWarImpact(['poverty', 'extremePoverty', 'foodInsecurity']));
router.get('/war/:name/black-market', conflictController.getWarImpact(['blackMarket', 'blackMarketGoods', 'profiteering']));
router.get('/war/:name/reconstruction', conflictController.getWarImpact(['reconstructionCost', 'costOfWar']));
router.get('/war/:name/currency-crisis', conflictController.getWarImpact(['currencyDevaluation', 'currencyGap']));
router.get('/war/:name/unemployment', conflictController.getWarImpact(['unemployment', 'youthUnemployment', 'preWarUnemployment', 'duringWarUnemployment']));

// Basic ID routes (MUST BE LAST to avoid catching literal string routes)
router.route('/:id')
  .get(conflictController.getConflictById)
  .put(conflictController.updateConflict)
  .patch(conflictController.patchConflict)
  .delete(conflictController.deleteConflict);

// Specific PATCH routes
router.patch('/:id/status', conflictController.patchConflict);
router.patch('/:id/inflation', conflictController.patchConflict);
router.patch('/:id/gdp', conflictController.patchConflict);
router.patch('/:id/poverty', conflictController.patchConflict);
router.patch('/:id/unemployment', conflictController.patchConflict);
router.patch('/:id/sector', conflictController.patchConflict);

module.exports = router;
