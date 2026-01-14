const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageType: {
    type: String,
    enum: ['basic', 'upgrade1', 'upgrade2', 'upgrade3', 'upgrade4', 'upgrade5'],
    default: 'basic'
  },
  amount: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'expired'], default: 'active' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Package', packageSchema);