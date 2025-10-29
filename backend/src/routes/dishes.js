const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const blackboxService = require('../services/blackboxService');
const matchingService = require('../services/matchingService');
const { auth, optionalAuth } = require('../middleware/auth');

// Get all dishes
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      isVegan, 
      cuisine, 
      difficulty, 
      search, 
      page = 1, 
      limit = 20 
    } = req.query;

    const query = {};
    
    if (isVegan !== undefined) {
      query.isVegan = isVegan === 'true';
    }
    
    if (cuisine) {
      query.cuisine = cuisine;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const dishes = await Dish.find(query)
      .populate('ingredients.ingredient')
      .populate('veganAlternative')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Dish.countDocuments(query);

    res.json({
      dishes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single dish
router.get('/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id)
      .populate('ingredients.ingredient')
      .populate('veganAlternative')
      .populate('originalDish')
      .populate('createdBy', 'name email')
      .populate('ratings.user', 'name');

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    res.json(dish);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new dish
router.post('/', auth, async (req, res) => {
  try {
    const dishData = {
      ...req.body,
      createdBy: req.user._id
    };

    const dish = new Dish(dishData);
    await dish.save();

    res.status(201).json(dish);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Generate vegan alternative for a dish
router.post('/generate-vegan-alternative', async (req, res) => {
  try {
    const { dishName, description, ingredients, cuisine } = req.body;

    if (!dishName) {
      return res.status(400).json({ error: 'Dish name is required' });
    }

    // First, check if we have a matching vegan dish in the database
    const existingMatch = await matchingService.findBestMatch({
      name: dishName,
      description,
      ingredients,
      cuisine
    });

    if (existingMatch) {
      return res.json({
        source: 'database',
        dish: existingMatch,
        message: 'Found matching vegan dish in database'
      });
    }

    // If no match, generate using Blackbox AI
    const veganAlternative = await blackboxService.generateVeganAlternative({
      name: dishName,
      description,
      ingredients,
      cuisine
    });

    // Save the generated dish to database
    const newDish = new Dish(veganAlternative);
    if (req.user) {
      newDish.createdBy = req.user._id;
    }
    await newDish.save();

    res.json({
      source: 'ai-generated',
      dish: newDish,
      message: 'Generated new vegan alternative using AI'
    });
  } catch (error) {
    console.error('Error generating vegan alternative:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analyze if a dish is vegan
router.post('/analyze-vegan', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'Ingredients are required' });
    }

    const analysis = await blackboxService.analyzeDishVeganStatus({
      ingredients
    });

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update dish
router.put('/:id', auth, async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    // Check if user is the creator
    if (dish.createdBy && dish.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this dish' });
    }

    Object.assign(dish, req.body);
    dish.updatedAt = Date.now();
    await dish.save();

    res.json(dish);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete dish
router.delete('/:id', auth, async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    // Check if user is the creator
    if (dish.createdBy && dish.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this dish' });
    }

    await dish.deleteOne();
    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add rating to dish
router.post('/:id/ratings', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    // Check if user already rated
    const existingRating = dish.ratings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
    } else {
      dish.ratings.push({
        user: req.user._id,
        rating,
        comment
      });
    }

    dish.updateAverageRating();
    await dish.save();

    res.json(dish);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
