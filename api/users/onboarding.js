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
const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: String,
  onboardingCompleted: { type: Boolean, default: false },
  onboardingStep: { type: Number, default: 0 },
  profile: mongoose.Schema.Types.Mixed
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

    const { firebaseUid, step, data, complete } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({ error: 'Firebase UID required' });
    }

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update onboarding step
    if (step !== undefined) {
      user.onboardingStep = step;
    }

    // Update profile data
    if (data) {
      user.profile = { ...user.profile, ...data };
      user.markModified('profile');
    }

    // Mark onboarding as complete
    if (complete) {
      user.onboardingCompleted = true;
      user.onboardingStep = step || 18; // Use provided step or default to 18
    }

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep: user.onboardingStep,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Onboarding save error:', error);
    res.status(500).json({ 
      error: 'Failed to save onboarding data',
      details: error.message 
    });
  }
};
