const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['market_maker', 'random_trader'], default: 'market_maker' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  strategy: { type: Object, default: {} },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bot', botSchema);