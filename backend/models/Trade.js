const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  buyOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  sellOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  productType: { type: String, enum: ['stock', 'commodity'], required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Only for commodity
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  tradedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trade', tradeSchema);