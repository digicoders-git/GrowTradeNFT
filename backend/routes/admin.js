const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { NFT, NFTBatch } = require('../models/NFT');
const Package = require('../models/Package');
const auth = require('../middleware/auth');
const router = express.Router();

// Admin middleware
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.email !== 'admin@growtradenfts.com') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Dashboard stats
router.get('/dashboard', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const frozenUsers = await User.countDocuments({ isFrozen: true });
    const totalNFTs = await NFT.countDocuments();
    const soldNFTs = await NFT.countDocuments({ status: 'sold' });
    const lockedNFTs = await NFT.countDocuments({ status: 'locked' });
    
    const totalRevenue = await Transaction.aggregate([
      { $match: { type: 'activation', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const mlmPayouts = await Transaction.aggregate([
      { $match: { type: 'referral_bonus', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const currentBatch = await NFTBatch.findOne({ isActive: true });
    
    res.json({
      stats: {
        totalUsers,
        activeUsers,
        frozenUsers,
        totalNFTs,
        soldNFTs,
        lockedNFTs,
        totalRevenue: totalRevenue[0]?.total || 0,
        mlmPayouts: mlmPayouts[0]?.total || 0,
        currentBatch: currentBatch?.batchNumber || 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// USER MANAGEMENT
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = 'all' } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { walletAddress: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status !== 'all') {
      if (status === 'active') query.isActive = true;
      if (status === 'inactive') query.isActive = false;
      if (status === 'frozen') query.isFrozen = true;
    }

    const users = await User.find(query)
      .select('-password')
      .populate('teamMembers', 'name email isActive')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Freeze/Unfreeze user
router.patch('/users/:userId/freeze', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isFrozen = !user.isFrozen;
    await user.save();

    res.json({
      message: `User ${user.isFrozen ? 'frozen' : 'unfrozen'} successfully`,
      user: { id: user._id, name: user.name, isFrozen: user.isFrozen }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Control user trading
router.patch('/users/:userId/trading', auth, adminAuth, async (req, res) => {
  try {
    const { canTrade } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.canTrade = canTrade;
    await user.save();

    res.json({
      message: `Trading ${canTrade ? 'enabled' : 'disabled'} for user`,
      user: { id: user._id, name: user.name, canTrade: user.canTrade }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Control user withdrawals
router.patch('/users/:userId/withdrawal', auth, adminAuth, async (req, res) => {
  try {
    const { canWithdraw } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.canWithdraw = canWithdraw;
    await user.save();

    res.json({
      message: `Withdrawal ${canWithdraw ? 'enabled' : 'disabled'} for user`,
      user: { id: user._id, name: user.name, canWithdraw: user.canWithdraw }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// NFT MANAGEMENT
router.get('/nfts', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, status = 'all', batchId } = req.query;
    
    let query = {};
    if (status !== 'all') query.status = status;
    if (batchId) query.batchId = parseInt(batchId);

    const nfts = await NFT.find(query)
      .populate('userId', 'name email walletAddress')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await NFT.countDocuments(query);
    const batches = await NFTBatch.find().sort({ batchNumber: 1 });

    res.json({ nfts, batches, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new NFT batch
router.post('/nft-batch', auth, adminAuth, async (req, res) => {
  try {
    const { totalNFTs = 4, basePrice = 10 } = req.body;
    
    const lastBatch = await NFTBatch.findOne().sort({ batchNumber: -1 });
    const newBatchNumber = lastBatch ? lastBatch.batchNumber + 1 : 1;

    const batch = new NFTBatch({
      batchNumber: newBatchNumber,
      totalNFTs,
      basePrice,
      isUnlocked: newBatchNumber === 1 // First batch is unlocked
    });

    await batch.save();
    res.json({ message: 'NFT batch created', batch });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Force unlock NFT batch
router.patch('/nft-batch/:batchId/unlock', auth, adminAuth, async (req, res) => {
  try {
    const batch = await NFTBatch.findOne({ batchNumber: req.params.batchId });
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    batch.isUnlocked = true;
    batch.isActive = true;
    await batch.save();

    res.json({ message: 'Batch unlocked successfully', batch });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// MLM REPORTS
router.get('/mlm-stats', auth, adminAuth, async (req, res) => {
  try {
    const levelStats = await Transaction.aggregate([
      { $match: { type: 'referral_bonus', status: 'completed' } },
      { $group: { 
        _id: '$referralLevel', 
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    const topEarners = await User.find({ totalEarnings: { $gt: 0 } })
      .select('name email totalEarnings mlmStats')
      .sort({ totalEarnings: -1 })
      .limit(10);

    res.json({ levelStats, topEarners });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;