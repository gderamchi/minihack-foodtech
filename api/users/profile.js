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
  profile: mongoose.Schema.Types.Mixed
}, { timestamps: true, minimize: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const firebaseUid = req.query.firebaseUid;
    if (!firebaseUid) {
      return res.status(400).json({ error: 'Firebase UID required' });
    }

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
        profile: user.profile,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Failed to get user profile',
      details: error.message 
    });
  }
};
