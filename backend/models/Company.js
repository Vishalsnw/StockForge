const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sector: { type: String, required: true },
  description: String,
  logoUrl: String,
  createdAt: { type: Date, default: Date.now },
  balance: { type: Number, default: 100000 },
  ipo: { type: mongoose.Schema.Types.ObjectId, ref: 'IPO' },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('Company', companySchema);