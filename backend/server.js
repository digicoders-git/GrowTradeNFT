const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/growtradenfts')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Import routes after DB connection
    const authRoutes = require('./routes/auth');
    const userRoutes = require('./routes/user');
    const walletRoutes = require('./routes/wallet');
    const nftRoutes = require('./routes/nft');
    const packageRoutes = require('./routes/package');
    const adminRoutes = require('./routes/admin');
    
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/wallet', walletRoutes);
    app.use('/api/nft', nftRoutes);
    app.use('/api/package', packageRoutes);
    app.use('/api/admin', adminRoutes);
    
  })
  .catch(err => {
    console.log('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Test URL: http://localhost:${PORT}/test`);
});