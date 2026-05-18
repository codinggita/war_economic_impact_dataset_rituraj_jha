const Conflict = require('../models/Conflict');

// Get all conflicts with advanced filtering, sorting, and pagination
exports.getConflicts = async (req, res) => {
  try {
    let query = {};
    const {
      status, region, country, type, keyword,
      inflationAbove, inflationBelow, minInflation, maxInflation,
      gdpLossAbove, minGDP, maxGDP,
      povertyAbove, minPoverty, maxPoverty,
      foodInsecurityAbove, currencyGapAbove,
      warCostAbove, reconstructionAbove,
      sector, blackMarket, profiteering,
      year, startYear, endYear,
      minUnemployment, maxUnemployment,
      sort, page, limit
    } = req.query;

    if (status) query.status = status;
    if (region) query.region = region;
    if (country) query.country = country;
    if (type) query.type = type;
    if (sector) query.sector = sector;
    if (blackMarket) query.blackMarket = blackMarket;
    if (profiteering) query.profiteering = profiteering;
    if (startYear) query.startYear = Number(startYear);
    if (endYear) query.endYear = Number(endYear);

    // Range filters
    if (inflationAbove || inflationBelow || minInflation || maxInflation) {
      query.inflation = {};
      if (inflationAbove) query.inflation.$gt = Number(inflationAbove);
      if (inflationBelow) query.inflation.$lt = Number(inflationBelow);
      if (minInflation) query.inflation.$gte = Number(minInflation);
      if (maxInflation) query.inflation.$lte = Number(maxInflation);
    }

    if (gdpLossAbove || minGDP || maxGDP) {
      query.gdpLoss = {};
      if (gdpLossAbove) query.gdpLoss.$gt = Number(gdpLossAbove);
      if (minGDP) query.gdpLoss.$gte = Number(minGDP);
      if (maxGDP) query.gdpLoss.$lte = Number(maxGDP);
    }

    if (povertyAbove || minPoverty || maxPoverty) {
      query.poverty = {};
      if (povertyAbove) query.poverty.$gt = Number(povertyAbove);
      if (minPoverty) query.poverty.$gte = Number(minPoverty);
      if (maxPoverty) query.poverty.$lte = Number(maxPoverty);
    }

    if (minUnemployment || maxUnemployment) {
      query.unemployment = {};
      if (minUnemployment) query.unemployment.$gte = Number(minUnemployment);
      if (maxUnemployment) query.unemployment.$lte = Number(maxUnemployment);
    }

    if (foodInsecurityAbove) query.foodInsecurity = { $gt: Number(foodInsecurityAbove) };
    if (currencyGapAbove) query.currencyGap = { $gt: Number(currencyGapAbove) };
    if (warCostAbove) query.costOfWar = { $gt: Number(warCostAbove) };
    if (reconstructionAbove) query.reconstructionCost = { $gt: Number(reconstructionAbove) };

    if (year) {
      query.startYear = { $lte: Number(year) };
      query.$or = [{ endYear: { $gte: Number(year) } }, { endYear: null }, { status: 'Ongoing' }];
    }

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { country: { $regex: keyword, $options: 'i' } },
        { region: { $regex: keyword, $options: 'i' } },
        { type: { $regex: keyword, $options: 'i' } }
      ];
    }

    let mongooseQuery = Conflict.find(query);

    if (sort) {
      const sortBy = sort.split(',').map(s => {
        if (s === 'Inflation_Rate_%') return 'inflation';
        if (s === '-Inflation_Rate_%') return '-inflation';
        if (s === 'GDP_Change_%') return 'gdpLoss';
        if (s === '-GDP_Change_%') return '-gdpLoss';
        if (s === 'Start_Year') return 'startYear';
        if (s === '-Start_Year') return '-startYear';
        if (s === 'End_Year') return 'endYear';
        if (s === '-End_Year') return '-endYear';
        if (s === 'Estimated_Reconstruction_Cost_USD') return 'reconstructionCost';
        if (s === '-Estimated_Reconstruction_Cost_USD') return '-reconstructionCost';
        if (s === 'Cost_of_War_USD') return 'costOfWar';
        if (s === '-Cost_of_War_USD') return '-costOfWar';
        if (s === 'Pre_War_Unemployment_%') return 'preWarUnemployment';
        if (s === '-During_War_Unemployment_%') return '-duringWarUnemployment';
        if (s === 'Food_Insecurity_Rate_%') return 'foodInsecurity';
        if (s === '-Extreme_Poverty_Rate_%') return '-extremePoverty';
        if (s === 'Currency_Devaluation_%') return 'currencyDevaluation';
        if (s === '-Currency_Black_Market_Rate_Gap_%') return '-currencyGap';
        if (s === 'Conflict_Name') return 'name';
        return s;
      }).join(' ');
      mongooseQuery = mongooseQuery.sort(sortBy);
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100;
    const skip = (pageNum - 1) * limitNum;
    
    mongooseQuery = mongooseQuery.skip(skip).limit(limitNum);

    const conflicts = await mongooseQuery;
    res.status(200).json(conflicts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConflictById = async (req, res) => {
  try {
    const conflict = await Conflict.findById(req.params.id);
    if (!conflict) return res.status(404).json({ message: 'Conflict not found' });
    res.status(200).json(conflict);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createConflict = async (req, res) => {
  try {
    const conflict = new Conflict(req.body);
    const savedConflict = await conflict.save();
    res.status(201).json(savedConflict);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateConflict = async (req, res) => {
  try {
    const conflict = await Conflict.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!conflict) return res.status(404).json({ message: 'Conflict not found' });
    res.status(200).json(conflict);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.patchConflict = async (req, res) => {
  try {
    const conflict = await Conflict.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!conflict) return res.status(404).json({ message: 'Conflict not found' });
    res.status(200).json(conflict);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteConflict = async (req, res) => {
  try {
    const conflict = await Conflict.findByIdAndDelete(req.params.id);
    if (!conflict) return res.status(404).json({ message: 'Conflict not found' });
    res.status(200).json({ message: 'Conflict deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route Parameters specific endpoints
exports.getByField = (field, isNumber = false) => async (req, res) => {
  try {
    const value = isNumber ? Number(req.params[field]) : req.params[field];
    const conflicts = await Conflict.find({ [field]: value });
    res.status(200).json(conflicts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRegionLatest = async (req, res) => {
  try {
    const conflict = await Conflict.find({ region: req.params.region }).sort({ startYear: -1 }).limit(1);
    res.status(200).json(conflict[0] || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRegionOldest = async (req, res) => {
  try {
    const conflict = await Conflict.find({ region: req.params.region }).sort({ startYear: 1 }).limit(1);
    res.status(200).json(conflict[0] || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCountryHistory = async (req, res) => {
  try {
    const conflicts = await Conflict.find({ country: req.params.country }).sort({ startYear: 1 });
    res.status(200).json(conflicts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCountByField = (field) => async (req, res) => {
  try {
    const count = await Conflict.countDocuments({ [field]: req.params[field] });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHighestBySector = (field, sortDir = -1) => async (req, res) => {
  try {
    const conflict = await Conflict.find({ sector: req.params.sector }).sort({ [field]: sortDir }).limit(1);
    res.status(200).json(conflict[0] || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWarImpact = (fields) => async (req, res) => {
  try {
    const conflict = await Conflict.findOne({ name: req.params.name }).select(fields.join(' '));
    if (!conflict) return res.status(404).json({ message: 'Conflict not found' });
    res.status(200).json(conflict);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Top and Stats endpoints
exports.getTopConflicts = (field, sortDir = -1) => async (req, res) => {
  try {
    const conflicts = await Conflict.find().sort({ [field]: sortDir }).limit(10);
    res.status(200).json(conflicts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
