const mongoose = require('mongoose');

const genericSchema = new mongoose.Schema({
  name: { type: String, required: false },
  conflictId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conflict', required: false },
  data: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

const Region = mongoose.model('Region', genericSchema);
const Country = mongoose.model('Country', genericSchema);
const EconomicRecord = mongoose.models.EconomicRecord || mongoose.model('EconomicRecord', genericSchema);
const PovertyRecord = mongoose.model('PovertyRecord', genericSchema);
const InflationRecord = mongoose.model('InflationRecord', genericSchema);
const BlackMarketRecord = mongoose.model('BlackMarketRecord', genericSchema);
const WarCostRecord = mongoose.model('WarCostRecord', genericSchema);
const ReconstructionRecord = mongoose.model('ReconstructionRecord', genericSchema);
const UnemploymentRecord = mongoose.model('UnemploymentRecord', genericSchema);

module.exports = {
  Region,
  Country,
  EconomicRecord,
  PovertyRecord,
  InflationRecord,
  BlackMarketRecord,
  WarCostRecord,
  ReconstructionRecord,
  UnemploymentRecord
};
