const mongoose = require('mongoose');

const conflictSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  region: { type: String, required: true },
  status: { type: String, required: true },
  country: { type: String },
  startYear: { type: Number },
  endYear: { type: Number },
  inflation: { type: Number },
  gdpLoss: { type: Number },
  poverty: { type: Number },
  extremePoverty: { type: Number },
  foodInsecurity: { type: Number },
  unemployment: { type: Number },
  youthUnemployment: { type: Number },
  preWarUnemployment: { type: Number },
  duringWarUnemployment: { type: Number },
  sector: { type: String },
  blackMarket: { type: String },
  blackMarketGoods: { type: String },
  profiteering: { type: String },
  currencyDevaluation: { type: Number },
  currencyGap: { type: Number },
  reconstructionCost: { type: Number },
  costOfWar: { type: Number },
  informalEconomyPre: { type: Number },
  informalEconomyDuring: { type: Number },
  households: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Conflict', conflictSchema);
