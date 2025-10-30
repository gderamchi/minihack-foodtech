const { MongoClient, ObjectId } = require('mongodb');
const shoppingListGenerator = require('../../backend/src/services/shoppingListGenerator');

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
    const { menuId, firebaseUid } = req.body;

    if (!menuId || !firebaseUid) {
      return res.status(400).json({ error: 'Menu ID and Firebase UID are required' });
    }

    // Get user from database
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get menu
    const menu = await db.collection('weeklymenus').findOne({ 
      _id: new ObjectId(menuId) 
    });

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    // Generate shopping list
    const userLocation = user.onboardingData?.personal?.location || null;
    const shoppingList = await shoppingListGenerator.generateShoppingList(menu, userLocation);

    return res.status(200).json({
      success: true,
      shoppingList
    });

  } catch (error) {
    console.error('Error generating shopping list:', error);
    return res.status(500).json({
      error: 'Failed to generate shopping list',
      message: error.message
    });
  }
};
