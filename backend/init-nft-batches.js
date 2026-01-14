const mongoose = require('mongoose');
const { NFTBatch } = require('./models/NFT');
require('dotenv').config();

const initializeNFTBatches = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Check if batches already exist
    const existingBatch = await NFTBatch.findOne();
    if (existingBatch) {
      console.log('❌ NFT batches already initialized');
      process.exit(0);
    }

    // Create first 5 batches
    const batches = [];
    for (let i = 1; i <= 5; i++) {
      const batch = new NFTBatch({
        batchNumber: i,
        totalNFTs: 4,
        basePrice: 10,
        isUnlocked: i === 1, // Only first batch is unlocked
        isActive: i === 1
      });
      batches.push(batch);
    }

    await NFTBatch.insertMany(batches);
    console.log('✅ NFT batches initialized successfully');
    console.log('📦 Created 5 batches, first batch is active');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing NFT batches:', error);
    process.exit(1);
  }
};

initializeNFTBatches();