const { MongoClient, ObjectId } = require('mongodb');
const weeklyMenuService = require('../../backend/src/services/weeklyMenuService');

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();
  cachedDb = db;
  return db;
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { menuId, dayIndex, mealIndex, firebaseUid } = req.body;

    if (!menuId || dayIndex === undefined || mealIndex === undefined || !firebaseUid) {
      return res.status(400).json({ 
        error: 'Menu ID, day index, meal index, and Firebase UID are required' 
      });
    }

    // Get user from database
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Swap the meal
    const updatedMenu = await weeklyMenuService.swapMeal(
      menuId,
      parseInt(dayIndex),
      parseInt(mealIndex),
      user._id
    );

    return res.status(200).json({
      success: true,
      message: 'Meal swapped successfully',
      menu: updatedMenu
    });

  } catch (error) {
    console.error('Error swapping meal:', error);
    return res.status(500).json({
      error: 'Failed to swap meal',
      message: error.message
    });
  }
};
