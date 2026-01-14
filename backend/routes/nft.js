const express = require('express');
const { NFT, NFTBatch } = require('../models/NFT');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const router = express.Router();

// Get current NFT batch (only 4 NFTs visible)
router.get('/marketplace', auth, async (req, res) => {
  try {
    const currentBatch = await NFTBatch.findOne({ isActive: true, isUnlocked: true });
    if (!currentBatch) {
      return res.json({ nfts: [], message: 'No NFTs available' });
    }

    const availableNFTs = await NFT.find({
      batchId: currentBatch.batchNumber,
      status: 'listed'
    }).limit(4);

    res.json({ nfts: availableNFTs, batch: currentBatch });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Buy NFT with investment limits
router.post('/buy', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.isActive || user.isFrozen || !user.canTrade) {
      return res.status(400).json({ message: 'Trading not allowed' });
    }

    user.resetDailyInvestment();
    
    const nftPrice = 10;
    if (user.dailyInvestment + nftPrice > user.planLimits.dailyLimit) {
      return res.status(400).json({ message: 'Daily investment limit exceeded' });
    }

    if (user.balance < nftPrice) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const currentBatch = await NFTBatch.findOne({ isActive: true, isUnlocked: true });
    if (!currentBatch) {
      return res.status(400).json({ message: 'No NFTs available for purchase' });
    }

    // Create NFT
    const nftId = `NFT_${Date.now()}_${user._id}`;
    const nft = new NFT({
      userId: user._id,
      nftId,
      batchId: currentBatch.batchNumber,
      buyPrice: nftPrice,
      sellPrice: nftPrice * 2,
      status: 'hold'
    });
    await nft.save();

    // Update user
    user.balance -= nftPrice;
    user.dailyInvestment += nftPrice;
    user.totalInvestment += nftPrice;
    user.lastInvestmentDate = new Date();
    await user.save();

    // Update batch
    currentBatch.soldNFTs += 1;
    if (currentBatch.soldNFTs >= 4) {
      currentBatch.isActive = false;
      // Unlock next batch
      const nextBatch = await NFTBatch.findOne({ batchNumber: currentBatch.batchNumber + 1 });
      if (nextBatch) {
        nextBatch.isUnlocked = true;
        await nextBatch.save();
      }
    }
    await currentBatch.save();

    res.json({ message: 'NFT purchased successfully', nft, newBalance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Sell NFT (2x price, creates 2 new NFTs)
router.post('/sell/:nftId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.canTrade) {
      return res.status(400).json({ message: 'Trading disabled by admin' });
    }

    const nft = await NFT.findOne({ nftId: req.params.nftId, userId: user._id, status: 'hold' });
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found or cannot be sold' });
    }

    // Check if user has other NFTs (cannot sell last NFT)
    const userNFTs = await NFT.countDocuments({ userId: user._id, status: { $in: ['hold', 'locked'] } });
    if (userNFTs <= 1) {
      return res.status(400).json({ message: 'Cannot sell last NFT. Purchase another first.' });
    }

    const sellPrice = nft.sellPrice;
    const userShare = sellPrice * 0.4; // 40%

    // Update original NFT
    nft.status = 'sold';
    nft.sellDate = new Date();
    await nft.save();

    // Create 2 new NFTs for buyer
    const newNFTPrice = sellPrice / 2;
    const nft1Id = `NFT_${Date.now()}_1_${user._id}`;
    const nft2Id = `NFT_${Date.now()}_2_${user._id}`;

    const newNFT1 = new NFT({
      userId: user._id,
      nftId: nft1Id,
      batchId: nft.batchId + 1,
      buyPrice: newNFTPrice,
      sellPrice: newNFTPrice * 2,
      status: 'locked',
      isLocked: true,
      generation: nft.generation + 1
    });

    const newNFT2 = new NFT({
      userId: user._id,
      nftId: nft2Id,
      batchId: nft.batchId + 1,
      buyPrice: newNFTPrice,
      sellPrice: newNFTPrice * 2,
      status: 'listed',
      generation: nft.generation + 1
    });

    await newNFT1.save();
    await newNFT2.save();

    // Update user balance
    user.balance += userShare;
    user.totalEarnings += userShare;
    await user.save();

    res.json({
      message: 'NFT sold successfully',
      profit: userShare,
      newNFTs: [newNFT1, newNFT2],
      newBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user NFTs
router.get('/my-nfts', auth, async (req, res) => {
  try {
    const nfts = await NFT.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    const stats = {
      total: nfts.length,
      holding: nfts.filter(n => n.status === 'hold').length,
      locked: nfts.filter(n => n.status === 'locked').length,
      listed: nfts.filter(n => n.status === 'listed').length,
      sold: nfts.filter(n => n.status === 'sold').length,
      totalProfit: nfts.reduce((sum, n) => sum + (n.profit || 0), 0)
    };

    res.json({ nfts, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;