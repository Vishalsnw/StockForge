const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  acquiredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Share', shareSchema);