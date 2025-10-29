// Main API handler for Vercel Serverless Functions
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const dishesRoutes = require('../backend/src/routes/dishes');
const menusRoutes = require('../backend/src/routes/menus');
const storesRoutes = require('../backend/src/routes/stores');
const usersRoutes = require('../backend/src/routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (with connection pooling for serverless)
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cachedDb = connection;
    console.log('MongoDB connected');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Vegan Diet API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/dishes', dishesRoutes);
app.use('/api/menus', menusRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/users', usersRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
});

// Export for Vercel
module.exports = async (req, res) => {
  // Connect to database
  await connectToDatabase();
  
  // Handle the request
  return app(req, res);
};
