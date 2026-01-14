const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('teamMembers', 'name email isActive')
      .select('-password');
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get MLM tree data
router.get('/mlm-tree', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('teamMembers', 'name email isActive createdAt teamMembers totalEarnings');
    
    const directReferrals = await User.find({ referredBy: user.referralCode })
      .select('name email isActive createdAt teamMembers totalEarnings')
      .populate('teamMembers', 'name');

    res.json({ 
      tree: {
        user: {
          name: user.name,
          referralCode: user.referralCode,
          totalEarnings: user.totalEarnings
        },
        directReferrals
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get MLM earnings breakdown
router.get('/mlm-earnings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get level-wise earnings
    const levelEarnings = await Transaction.aggregate([
      { $match: { userId: user._id, type: 'referral_bonus', status: 'completed' } },
      { $group: { 
        _id: '$referralLevel', 
        amount: { $sum: '$amount' },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    const earnings = levelEarnings.map(item => ({
      level: item._id,
      amount: item.amount,
      count: item.count
    }));

    const stats = {
      totalReferrals: user.mlmStats.totalReferrals,
      activeReferrals: user.mlmStats.activeReferrals,
      totalEarnings: user.totalEarnings,
      missedEarnings: user.mlmStats.missedEarnings,
      referralCode: user.referralCode
    };

    res.json({ earnings, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get team members
router.get('/team', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('teamMembers', 'name email isActive createdAt');
    
    res.json({ teamMembers: user.teamMembers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('teamMembers', 'isActive');
    
    const totalTransactions = await Transaction.countDocuments({ userId: req.user._id });
    const recentTransactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const stats = {
      balance: user.balance,
      totalEarnings: user.totalEarnings,
      teamSize: user.teamMembers.length,
      activeTeamMembers: user.teamMembers.filter(member => member.isActive).length,
      totalTransactions,
      recentTransactions,
      nftCount: user.nfts.length,
      dailyInvestment: user.dailyInvestment,
      totalInvestment: user.totalInvestment,
      currentPlan: user.currentPlan,
      planLimits: user.planLimits
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;