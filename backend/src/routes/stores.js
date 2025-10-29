const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const locationService = require('../services/locationService');
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

// Find nearby stores (must be before /:id route)
router.get('/nearby', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ 
        error: 'Longitude and latitude are required' 
      });
    }

    const stores = await locationService.findNearbyStores(
      parseFloat(longitude),
      parseFloat(latitude),
      parseInt(maxDistance)
    );

    res.json(stores);
  } catch (error) {
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

// Get store recommendations for a dish
router.post('/recommendations-for-dish', async (req, res) => {
  try {
    const { dishId, longitude, latitude } = req.body;

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

    const recommendations = await locationService.getStoreRecommendationsForDish(
      dish,
      parseFloat(longitude),
      parseFloat(latitude)
    );

    res.json(recommendations);
  } catch (error) {
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
