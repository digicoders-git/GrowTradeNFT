const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Generate referral code
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { name, email, mobile, password, walletAddress, referralCode } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !password || !walletAddress) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate wallet address format
    if (!walletAddress.startsWith('0x') || walletAddress.length !== 42) {
      console.log('Invalid wallet address:', walletAddress);
      return res.status(400).json({ message: 'Invalid wallet address format' });
    }

    // Check referral code if provided
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
      if (!referrer) {
        console.log('Invalid referral code:', referralCode);
        return res.status(400).json({ message: 'Invalid referral code' });
      }
    }

    // Hash password manually
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');

    // Create user
    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword, // Use hashed password
      walletAddress,
      referralCode: generateReferralCode(),
      referredBy: referrer ? referrer.referralCode : null
    });

    console.log('Saving user to database...');
    await user.save();
    console.log('User saved successfully');

    // Add to referrer's team
    if (referrer) {
      referrer.teamMembers.push(user._id);
      await referrer.save();
      console.log('Added to referrer team');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    console.log('Registration successful for:', email);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        referralCode: user.referralCode,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Login - Allow only activated users
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is activated
    if (!user.isActive) {
      console.log('User not activated:', email);
      return res.status(400).json({ 
        message: 'Account not activated. Please complete payment to activate your account.',
        needsActivation: true
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    console.log('Login successful for:', email);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        referralCode: user.referralCode,
        isActive: user.isActive,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;