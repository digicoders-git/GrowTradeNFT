const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const router = express.Router();

// Activate wallet with $10 payment
router.post('/activate', auth, async (req, res) => {
  try {
    console.log('Wallet activation request:', req.body);
    
    const { txHash, walletAddress } = req.body;
    
    if (!txHash || !walletAddress) {
      return res.status(400).json({ message: 'Transaction hash and wallet address required' });
    }

    const user = await User.findById(req.user._id);
    
    if (user.isActive) {
      return res.status(400).json({ message: 'Account already activated' });
    }

    console.log(`Processing activation for user: ${user.email}`);

    // Create activation transaction
    const transaction = new Transaction({
      userId: user._id,
      type: 'activation',
      amount: 10,
      status: 'completed',
      txHash,
      walletAddress,
      description: 'Account activation payment'
    });

    await transaction.save();
    console.log('Activation transaction saved');

    // Activate user and add initial balance
    user.isActive = true;
    user.activationPaid = true;
    user.balance += 10;
    await user.save();
    console.log(`User ${user.email} activated successfully`);

    // Process referral bonuses
    await processReferralBonuses(user);
    console.log('Referral bonuses processed');

    res.json({ 
      message: 'Account activated successfully',
      user: {
        id: user._id,
        isActive: user.isActive,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error('Activation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Process referral bonuses (MLM logic)
const processReferralBonuses = async (newUser) => {
  try {
    if (!newUser.referredBy) {
      console.log('No referrer found, $10 goes to company wallet');
      return;
    }

    let currentUser = newUser;
    const activationAmount = 10;
    
    // Process 10 levels of MLM
    for (let level = 1; level <= 10; level++) {
      if (!currentUser.referredBy) {
        console.log(`Level ${level}: No upline, remaining amount goes to company wallet`);
        break;
      }

      const upline = await User.findOne({ referralCode: currentUser.referredBy });
      if (!upline) {
        console.log(`Level ${level}: Upline not found, amount goes to company wallet`);
        break;
      }

      // Check if upline is active
      if (!upline.isActive) {
        console.log(`Level ${level}: Upline ${upline.email} inactive, amount goes to company wallet`);
        upline.mlmStats.missedEarnings += 1;
        await upline.save();
        currentUser = upline;
        continue;
      }

      // Give $1 to each level
      const levelBonus = 1;
      upline.balance += levelBonus;
      upline.totalEarnings += levelBonus;
      upline.mlmStats.levelEarnings[level - 1] = (upline.mlmStats.levelEarnings[level - 1] || 0) + levelBonus;
      await upline.save();

      // Create bonus transaction
      const bonusTransaction = new Transaction({
        userId: upline._id,
        type: 'referral_bonus',
        amount: levelBonus,
        status: 'completed',
        description: `Level ${level} MLM bonus from ${newUser.name}`,
        referralLevel: level
      });
      await bonusTransaction.save();
      
      console.log(`Level ${level}: $${levelBonus} given to ${upline.email}`);
      currentUser = upline;
    }
  } catch (error) {
    console.error('Error processing referral bonuses:', error);
  }
};

// Withdraw funds
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, walletAddress } = req.body;
    
    if (!amount || !walletAddress) {
      return res.status(400).json({ message: 'Amount and wallet address required' });
    }

    const user = await User.findById(req.user._id);
    
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    if (amount < 5) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is $5' });
    }

    // Create withdrawal transaction
    const transaction = new Transaction({
      userId: user._id,
      type: 'withdrawal',
      amount,
      status: 'pending',
      walletAddress,
      description: 'Withdrawal request'
    });

    await transaction.save();

    // Deduct from balance
    user.balance -= amount;
    await user.save();

    res.json({ 
      message: 'Withdrawal request submitted',
      transaction: {
        id: transaction._id,
        amount,
        status: transaction.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get wallet balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ 
      balance: user.balance,
      totalEarnings: user.totalEarnings,
      isActive: user.isActive
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;