const connectDB = require('../../backend/src/config/database');
const User = require('../../backend/src/models/User');

module.exports = async function handler(req, res) {
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
    res.status(500).json({ error: 'Failed to create or update user' });
  }
};
