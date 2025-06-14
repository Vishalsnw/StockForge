const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  type: { type: String, enum: ['buy', 'sell'], required: true },
  productType: { type: String, enum: ['stock', 'commodity'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Only for commodity
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['open', 'matched', 'cancelled'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  matchedAt: { type: Date }
});

module.exports = mongoose.model('Order', orderSchema);