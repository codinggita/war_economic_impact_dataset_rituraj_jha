const Conflict = require('../models/Conflict');

exports.globalSearch = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ message: 'Keyword is required' });
    const conflicts = await Conflict.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { country: { $regex: keyword, $options: 'i' } },
        { region: { $regex: keyword, $options: 'i' } },
        { type: { $regex: keyword, $options: 'i' } },
        { sector: { $regex: keyword, $options: 'i' } }
      ]
    });
    res.status(200).json(conflicts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.conflictSearch = async (req, res) => {
  try {
    const { country, region, type, status } = req.query;
    let query = {};
    if (country) query.country = { $regex: country, $options: 'i' };
    if (region) query.region = { $regex: region, $options: 'i' };
    if (type) query.type = { $regex: type, $options: 'i' };
    if (status) query.status = { $regex: status, $options: 'i' };
    const conflicts = await Conflict.find(query);
    res.status(200).json(conflicts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.economicSearch = async (req, res) => {
  try {
    const { inflation, poverty, gdp, currency } = req.query;
    let query = {};
    if (inflation) query.inflation = { $gte: Number(inflation) };
    if (poverty) query.poverty = { $gte: Number(poverty) };
    if (gdp) query.gdpLoss = { $lte: Number(gdp) }; // Assuming gdp loss is negative or positive, $lte if negative
    if (currency) query.currencyGap = { $gte: Number(currency) };
    const conflicts = await Conflict.find(query);
    res.status(200).json(conflicts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sectorSearch = async (req, res) => {
  try {
    const { name } = req.query;
    const conflicts = await Conflict.find({ sector: { $regex: name, $options: 'i' } });
    res.status(200).json(conflicts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.blackMarketSearch = async (req, res) => {
  try {
    const { goods } = req.query;
    const conflicts = await Conflict.find({ blackMarketGoods: { $regex: goods, $options: 'i' } });
    res.status(200).json(conflicts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
