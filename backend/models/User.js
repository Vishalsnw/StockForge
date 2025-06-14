const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  companies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
  isBot: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  balance: { type: Number, default: 100000 }
});

module.exports = mongoose.model('User', userSchema);