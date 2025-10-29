const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedMenus')
      .populate('savedDishes');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'location', 'preferences'];
    const actualUpdates = Object.keys(updates).filter(key => 
      allowedUpdates.includes(key)
    );

    actualUpdates.forEach(update => {
      req.user[update] = updates[update];
    });

    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user location
router.put('/me/location', auth, async (req, res) => {
  try {
    const { longitude, latitude, address } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({ 
        error: 'Longitude and latitude are required' 
      });
    }

    req.user.location = {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
      address: address || ''
    };

    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Save menu to user's saved menus
router.post('/me/saved-menus/:menuId', auth, async (req, res) => {
  try {
    const { menuId } = req.params;

    if (!req.user.savedMenus.includes(menuId)) {
      req.user.savedMenus.push(menuId);
      await req.user.save();
    }

    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove menu from saved menus
router.delete('/me/saved-menus/:menuId', auth, async (req, res) => {
  try {
    const { menuId } = req.params;

    req.user.savedMenus = req.user.savedMenus.filter(
      id => id.toString() !== menuId
    );
    await req.user.save();

    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Save dish to user's saved dishes
router.post('/me/saved-dishes/:dishId', auth, async (req, res) => {
  try {
    const { dishId } = req.params;

    if (!req.user.savedDishes.includes(dishId)) {
      req.user.savedDishes.push(dishId);
      await req.user.save();
    }

    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove dish from saved dishes
router.delete('/me/saved-dishes/:dishId', auth, async (req, res) => {
  try {
    const { dishId } = req.params;

    req.user.savedDishes = req.user.savedDishes.filter(
      id => id.toString() !== dishId
    );
    await req.user.save();

    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Change password
router.put('/me/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    req.user.password = newPassword;
    await req.user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
