const mongoose = require('mongoose');

const ipoSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  totalShares: { type: Number, required: true },
  sharePrice: { type: Number, required: true },
  sharesAvailable: { type: Number, required: true },
  isOpen: { type: Boolean, default: true },
  launchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IPO', ipoSchema);