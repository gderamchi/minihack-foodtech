const connectDB = require('../../backend/src/config/database');
const User = require('../../backend/src/models/User');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

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
    }

    // Mark onboarding as complete
    if (complete) {
      user.onboardingCompleted = true;
      user.onboardingStep = 8;
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
    res.status(500).json({ error: 'Failed to save onboarding data' });
  }
};
