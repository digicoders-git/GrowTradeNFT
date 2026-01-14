const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['activation', 'referral_bonus', 'nft_purchase', 'withdrawal'], 
    required: true 
  },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  txHash: { type: String },
  walletAddress: { type: String },
  description: { type: String },
  referralLevel: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);