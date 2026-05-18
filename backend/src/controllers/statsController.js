const Conflict = require('../models/Conflict');

exports.getTotalConflicts = async (req, res) => {
  try {
    const count = await Conflict.countDocuments();
    res.status(200).json({ total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOngoingConflicts = async (req, res) => {
  try {
    const count = await Conflict.countDocuments({ status: 'Ongoing' });
    res.status(200).json({ ongoing: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResolvedConflicts = async (req, res) => {
  try {
    const count = await Conflict.countDocuments({ status: 'Resolved' });
    res.status(200).json({ resolved: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHighestInflation = async (req, res) => {
  try {
    const conflict = await Conflict.findOne().sort({ inflation: -1 }).select('name inflation');
    res.status(200).json(conflict);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLowestGdp = async (req, res) => {
  try {
    const conflict = await Conflict.findOne().sort({ gdpLoss: -1 }).select('name gdpLoss'); // assuming more negative is lower
    res.status(200).json(conflict);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHighestPoverty = async (req, res) => {
  try {
    const conflict = await Conflict.findOne().sort({ poverty: -1 }).select('name poverty');
    res.status(200).json(conflict);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHighestFoodInsecurity = async (req, res) => {
  try {
    const conflict = await Conflict.findOne().sort({ foodInsecurity: -1 }).select('name foodInsecurity');
    res.status(200).json(conflict);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHighestCurrencyGap = async (req, res) => {
  try {
    const conflict = await Conflict.findOne().sort({ currencyGap: -1 }).select('name currencyGap');
    res.status(200).json(conflict);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHighestWarCost = async (req, res) => {
  try {
    const conflict = await Conflict.findOne().sort({ costOfWar: -1 }).select('name costOfWar');
    res.status(200).json(conflict);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHighestReconstructionCost = async (req, res) => {
  try {
    const conflict = await Conflict.findOne().sort({ reconstructionCost: -1 }).select('name reconstructionCost');
    res.status(200).json(conflict);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
