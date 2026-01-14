const express = require('express');
const Package = require('../models/Package');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const router = express.Router();

const INVESTMENT_PLANS = {
  basic: { amount: 10, dailyLimit: 100, totalLimit: 1000 },
  plan25: { amount: 25, dailyLimit: 250, totalLimit: 2500 },
  plan50: { amount: 50, dailyLimit: 500, totalLimit: 5000 },
  plan100: { amount: 100, dailyLimit: 1000, totalLimit: 10000 },
  plan250: { amount: 250, dailyLimit: 2500, totalLimit: 25000 },
  plan500: { amount: 500, dailyLimit: 5000, totalLimit: 50000 }
};

// Get available plans
router.get('/plans', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      plans: INVESTMENT_PLANS,
      currentPlan: user.currentPlan,
      currentLimits: user.planLimits,
      dailyInvestment: user.dailyInvestment,
      totalInvestment: user.totalInvestment,
      userBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upgrade plan (NO MLM on upgrades)
router.post('/upgrade', auth, async (req, res) => {
  try {
    const { planType } = req.body;
    
    if (!INVESTMENT_PLANS[planType]) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }

    const user = await User.findById(req.user._id);
    const planInfo = INVESTMENT_PLANS[planType];
    
    // Check if user already has this plan or higher
    const currentPlanValue = INVESTMENT_PLANS[user.currentPlan].amount;
    if (planInfo.amount <= currentPlanValue) {
      return res.status(400).json({ message: 'Cannot downgrade or same plan' });
    }
    
    if (user.balance < planInfo.amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deactivate current package
    await Package.updateMany(
      { userId: user._id, status: 'active' },
      { status: 'expired' }
    );

    // Create new package
    const newPackage = new Package({
      userId: user._id,
      packageType: planType,
      amount: planInfo.amount
    });
    await newPackage.save();

    // Update user plan and limits
    user.balance -= planInfo.amount;
    user.currentPlan = planType;
    user.planLimits = {
      dailyLimit: planInfo.dailyLimit,
      totalLimit: planInfo.totalLimit
    };
    await user.save();

    // Create transaction (NO MLM distribution)
    const transaction = new Transaction({
      userId: user._id,
      type: 'package_upgrade',
      amount: planInfo.amount,
      status: 'completed',
      description: `Upgraded to ${planType} plan - Amount goes to company wallet`
    });
    await transaction.save();

    res.json({
      message: 'Plan upgraded successfully',
      package: newPackage,
      newBalance: user.balance,
      newLimits: user.planLimits
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's current package
router.get('/current', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const currentPackage = await Package.findOne({ 
      userId: user._id, 
      status: 'active' 
    }).sort({ createdAt: -1 });
    
    res.json({
      currentPlan: user.currentPlan,
      planLimits: user.planLimits,
      dailyInvestment: user.dailyInvestment,
      totalInvestment: user.totalInvestment,
      package: currentPackage
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;