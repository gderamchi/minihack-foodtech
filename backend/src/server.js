require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import models to register them
require('./models/User');
require('./models/Ingredient');
require('./models/Dish');
require('./models/Menu');
require('./models/Store');

// Import routes
const dishesRoutes = require('./routes/dishes');
const menusRoutes = require('./routes/menus');
const storesRoutes = require('./routes/stores');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Vegan Diet API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/dishes', dishesRoutes);
app.use('/api/menus', menusRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/users', usersRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Vegan Diet Rotation API',
    version: '1.0.0',
    endpoints: {
      dishes: '/api/dishes',
      menus: '/api/menus',
      stores: '/api/stores',
      users: '/api/users',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🌱 Vegan Diet Rotation API Server                  ║
║                                                       ║
║   Server running on port ${PORT}                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║                                                       ║
║   API Endpoints:                                      ║
║   - http://localhost:${PORT}/api/dishes                 ║
║   - http://localhost:${PORT}/api/menus                  ║
║   - http://localhost:${PORT}/api/stores                 ║
║   - http://localhost:${PORT}/api/users                  ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});
