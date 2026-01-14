const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nftId: { type: String, required: true, unique: true },
  batchId: { type: Number, required: true }, // NFT batch (1,2,3,4)
  buyPrice: { type: Number, required: true },
  sellPrice: { type: Number }, // 2x buyPrice
  status: { 
    type: String, 
    enum: ['hold', 'listed', 'sold', 'locked'], 
    default: 'hold' 
  },
  isLocked: { type: Boolean, default: false }, // Auto-locked NFTs
  buyDate: { type: Date, default: Date.now },
  sellDate: { type: Date },
  profit: { type: Number, default: 0 },
  generation: { type: Number, default: 1 } // NFT generation level
}, {
  timestamps: true
});

// NFT Batch Management Schema
const nftBatchSchema = new mongoose.Schema({
  batchNumber: { type: Number, required: true, unique: true },
  totalNFTs: { type: Number, default: 4 },
  soldNFTs: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isUnlocked: { type: Boolean, default: false },
  basePrice: { type: Number, default: 10 }
}, {
  timestamps: true
});

module.exports = {
  NFT: mongoose.model('NFT', nftSchema),
  NFTBatch: mongoose.model('NFTBatch', nftBatchSchema)
};