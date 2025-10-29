const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const locationService = require('../services/locationService');
const osmStoreService = require('../services/osmStoreService');
const ingredientMatchingService = require('../services/ingredientMatchingService');
const { auth, optionalAuth } = require('../middleware/auth');

// Get all stores
router.get('/', async (req, res) => {
  try {
    const { 
      type, 
      hasVeganSection, 
      search, 
      page = 1, 
      limit = 20 
    } = req.query;

    const query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (hasVeganSection !== undefined) {
      query.hasVeganSection = hasVeganSection === 'true';
    }

    if (search) {
      query.$text = { $search: search };
    }

    const stores = await Store.find(query)
      .populate('availableIngredients')
      .sort({ averageRating: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Store.countDocuments(query);

    res.json({
      stores,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Find nearby stores using OpenStreetMap (must be before /:id route)
router.get('/nearby', async (req, res) => {
  try {
    const { 
      longitude, 
      latitude, 
      maxDistance = 5000, 
      useOSM = 'true',
      limit = 50,
      page = 1
    } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ 
        error: 'Longitude and latitude are required' 
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const limitNum = Math.min(parseInt(limit), 100); // Max 100 stores per request
    const pageNum = parseInt(page);

    // Use OpenStreetMap for real-time store data
    if (useOSM === 'true') {
      console.log(`Fetching stores from OSM near ${lat}, ${lon} within ${maxDistance}m (limit: ${limitNum}, page: ${pageNum})`);
      const allStores = await osmStoreService.findNearbyStores(lat, lon, parseInt(maxDistance));
      
      // Implement pagination
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedStores = allStores.slice(startIndex, endIndex);
      
      console.log(`Found ${allStores.length} total stores, returning ${paginatedStores.length} for page ${pageNum}`);
      
      return res.json({
        stores: paginatedStores,
        pagination: {
          total: allStores.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(allStores.length / limitNum),
          hasMore: endIndex < allStores.length
        }
      });
    }

    // Fallback to database stores
    const stores = await locationService.findNearbyStores(lon, lat, parseInt(maxDistance));
    res.json({
      stores: stores.slice(0, limitNum),
      pagination: {
        total: stores.length,
        page: 1,
        limit: limitNum,
        totalPages: Math.ceil(stores.length / limitNum),
        hasMore: stores.length > limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching nearby stores:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single store
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate('availableIngredients')
      .populate('ratings.user', 'name');

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Find stores with specific ingredients
router.post('/find-with-ingredients', async (req, res) => {
  try {
    const { ingredientIds, longitude, latitude, maxDistance = 5000 } = req.body;

    if (!ingredientIds || ingredientIds.length === 0) {
      return res.status(400).json({ error: 'Ingredient IDs are required' });
    }

    if (!longitude || !latitude) {
      return res.status(400).json({ 
        error: 'Longitude and latitude are required' 
      });
    }

    const stores = await locationService.findStoresWithIngredients(
      ingredientIds,
      parseFloat(longitude),
      parseFloat(latitude),
      parseInt(maxDistance)
    );

    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get store recommendations for a dish with intelligent matching
router.post('/recommendations-for-dish', async (req, res) => {
  try {
    const { dishId, longitude, latitude, maxDistance = 5000 } = req.body;

    if (!dishId) {
      return res.status(400).json({ error: 'Dish ID is required' });
    }

    if (!longitude || !latitude) {
      return res.status(400).json({ 
        error: 'Longitude and latitude are required' 
      });
    }

    const Dish = require('../models/Dish');
    const dish = await Dish.findById(dishId).populate('ingredients.ingredient');

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Get nearby stores from OSM
    console.log(`Finding stores for dish: ${dish.name}`);
    const osmStores = await osmStoreService.findNearbyStores(lat, lon, parseInt(maxDistance));
    
    // Use AI to match ingredients to stores
    const ingredients = dish.ingredients.map(ing => ({
      name: ing.name,
      quantity: ing.quantity
    }));
    
    console.log(`Analyzing ${ingredients.length} ingredients for ${osmStores.length} stores`);
    const rankedStores = await ingredientMatchingService.analyzeIngredientsForStores(
      ingredients,
      osmStores
    );

    res.json({
      dish: {
        _id: dish._id,
        name: dish.name,
        ingredients: ingredients
      },
      stores: rankedStores.slice(0, 10), // Return top 10 stores
      totalStoresFound: osmStores.length
    });
  } catch (error) {
    console.error('Error getting store recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new store (admin only for now)
router.post('/', auth, async (req, res) => {
  try {
    const store = new Store(req.body);
    await store.save();

    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update store
router.put('/:id', auth, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    Object.assign(store, req.body);
    store.updatedAt = Date.now();
    await store.save();

    res.json(store);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete store
router.delete('/:id', auth, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    await store.deleteOne();
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add rating to store
router.post('/:id/ratings', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if user already rated
    const existingRating = store.ratings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
    } else {
      store.ratings.push({
        user: req.user._id,
        rating,
        comment
      });
    }

    store.updateAverageRating();
    await store.save();

    res.json(store);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
