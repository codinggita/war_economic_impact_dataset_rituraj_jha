const mongoose = require('mongoose');

const conflictSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Conflict', conflictSchema);
