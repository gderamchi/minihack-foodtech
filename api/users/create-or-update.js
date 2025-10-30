const mongoose = require('mongoose');

// MongoDB connection
let cachedDb = null;

async function connectDB() {
  if (cachedDb) {
    return cachedDb;
  }

  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = conn;
  return conn;
}

// User Schema (inline for serverless)
const personSchema = new mongoose.Schema({
  name: String,
  relationship: String,
  ageGroup: String,
  height: Number,
  weight: Number,
  gender: String,
  activityLevel: String,
  appetiteSize: String,
  eatingHabits: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: String,
  onboardingCompleted: { type: Boolean, default: false },
  onboardingStep: { type: Number, default: 0 },
  profile: {
    personal: {
      age: Number,
      location: {
        type: { type: String, enum: ['Point'] },
        coordinates: [Number],
        address: String
      },
      householdSize: Number,
      householdType: String
    },
    people: [personSchema],
    dietary: {
      restrictions: [String],
      allergies: [String],
      intolerances: [String]
    },
    foodPreferences: {
      favoriteCuisines: [String],
      dislikedIngredients: [String],
      preferredIngredients: [String],
      spiceTolerance: String,
      texturePreferences: [String],
      flavorProfiles: [String]
    },
    cooking: {
      skillLevel: String,
      timeAvailable: Number,
      frequency: String,
      equipment: [String],
      mealPrepPreference: String
    },
    mealPlanning: {
      mealsPerDay: Number,
      mealTypes: [String],
      budget: String,
      shoppingPreference: String,
      leftoverPreference: String
    },
    health: {
      primaryGoal: String,
      calorieTarget: Number,
      macroPreferences: String,
      nutritionalFocus: [String]
    },
    automation: {
      enabled: { type: Boolean, default: false },
      startDay: String,
      daysInAdvance: Number,
      notifications: { type: Boolean, default: false },
      notificationTime: String,
      recurringPreferences: [String],
      varietyPreference: String
    }
  },
  savedMenus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
  savedDishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }],
  favoriteWeeklyMenus: [{
    name: String,
    menu: mongoose.Schema.Types.Mixed,
    savedAt: Date
  }]
}, { timestamps: true, minimize: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { firebaseUid, email, name, photoURL } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({ error: 'Firebase UID and email are required' });
    }

    // Find or create user
    let user = await User.findOne({ firebaseUid });

    if (user) {
      // Update existing user
      user.email = email;
      user.name = name || user.name;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        firebaseUid,
        email,
        name: name || email.split('@')[0],
        onboardingCompleted: false,
        onboardingStep: 0,
        profile: {}
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep: user.onboardingStep,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Create/update user error:', error);
    res.status(500).json({ 
      error: 'Failed to create or update user',
      details: error.message 
    });
  }
};
