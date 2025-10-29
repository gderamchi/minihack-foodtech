const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const { auth, optionalAuth } = require('../middleware/auth');

// Get all menus
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      type, 
      isVegan, 
      cuisine, 
      occasion, 
      search, 
      page = 1, 
      limit = 20 
    } = req.query;

    const query = { isPublished: true };
    
    if (type) {
      query.type = type;
    }
    
    if (isVegan !== undefined) {
      query.isVegan = isVegan === 'true';
    }
    
    if (cuisine) {
      query.cuisine = cuisine;
    }
    
    if (occasion) {
      query.occasion = occasion;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const menus = await Menu.find(query)
      .populate({
        path: 'dishes.dish',
        populate: { path: 'ingredients.ingredient' }
      })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Menu.countDocuments(query);

    res.json({
      menus,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single menu
router.get('/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
      .populate({
        path: 'dishes.dish',
        populate: { path: 'ingredients.ingredient' }
      })
      .populate('createdBy', 'name email')
      .populate('ratings.user', 'name');

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new menu
router.post('/', auth, async (req, res) => {
  try {
    const menuData = {
      ...req.body,
      createdBy: req.user._id,
      type: req.body.type || 'community'
    };

    const menu = new Menu(menuData);
    await menu.save();

    res.status(201).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update menu
router.put('/:id', auth, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    // Check if user is the creator
    if (menu.createdBy && menu.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this menu' });
    }

    Object.assign(menu, req.body);
    menu.updatedAt = Date.now();
    await menu.save();

    res.json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete menu
router.delete('/:id', auth, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    // Check if user is the creator
    if (menu.createdBy && menu.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this menu' });
    }

    await menu.deleteOne();
    res.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add rating to menu
router.post('/:id/ratings', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    // Check if user already rated
    const existingRating = menu.ratings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
    } else {
      menu.ratings.push({
        user: req.user._id,
        rating,
        comment
      });
    }

    menu.updateAverageRating();
    await menu.save();

    res.json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get featured/base menus
router.get('/featured/base', async (req, res) => {
  try {
    const menus = await Menu.find({ 
      type: 'base',
      isPublished: true 
    })
      .populate({
        path: 'dishes.dish',
        populate: { path: 'ingredients.ingredient' }
      })
      .sort({ averageRating: -1 })
      .limit(10);

    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
