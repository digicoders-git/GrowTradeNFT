const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  walletAddress: { type: String, required: true },
  referralCode: { type: String, unique: true },
  referredBy: { type: String, default: null },
  isActive: { type: Boolean, default: false },
  activationPaid: { type: Boolean, default: false },
  isFrozen: { type: Boolean, default: false }, // Admin freeze
  canWithdraw: { type: Boolean, default: true }, // Admin control
  canTrade: { type: Boolean, default: true }, // Admin control
  balance: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  dailyInvestment: { type: Number, default: 0 },
  totalInvestment: { type: Number, default: 0 },
  lastInvestmentDate: { type: Date },
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  level: { type: Number, default: 1 },
  currentPlan: {
    type: String,
    enum: ['basic', 'plan25', 'plan50', 'plan100', 'plan250', 'plan500'],
    default: 'basic'
  },
  planLimits: {
    dailyLimit: { type: Number, default: 100 },
    totalLimit: { type: Number, default: 1000 }
  },
  nfts: [{
    tokenId: String,
    name: String,
    image: String,
    purchasePrice: Number,
    purchaseDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['hold', 'locked', 'listed'], default: 'hold' }
  }],
  mlmStats: {
    totalReferrals: { type: Number, default: 0 },
    activeReferrals: { type: Number, default: 0 },
    levelEarnings: [{ type: Number, default: 0 }], // 10 levels
    missedEarnings: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Reset daily investment at midnight
userSchema.methods.resetDailyInvestment = function() {
  const today = new Date().toDateString();
  const lastInvestment = this.lastInvestmentDate ? this.lastInvestmentDate.toDateString() : null;
  
  if (today !== lastInvestment) {
    this.dailyInvestment = 0;
  }
};

module.exports = mongoose.model('User', userSchema);