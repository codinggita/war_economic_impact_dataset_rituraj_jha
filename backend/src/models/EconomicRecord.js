const mongoose = require('mongoose');

const economicRecordSchema = new mongoose.Schema({
  conflict: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conflict',
    required: true,
  },
  gdpChange: {
    type: Number,
  },
  inflation: {
    type: Number,
  },
  povertyRates: {
    type: Number,
  },
  reconstructionCosts: {
    type: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model('EconomicRecord', economicRecordSchema);
