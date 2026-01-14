const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
    
    // Create indexes for better performance
    const User = require('./models/User');
    const Transaction = require('./models/Transaction');
    
    await User.createIndexes();
    await Transaction.createIndexes();
    
    console.log('✅ Database indexes created');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();