const { MongoClient } = require('mongodb');

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

function getStartOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff));
}

function getEndOfWeek() {
  const start = getStartOfWeek();
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firebaseUid } = req.query;

    if (!firebaseUid) {
      return res.status(400).json({ error: 'Firebase UID is required' });
    }

    // Get user from database
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get current week's menu
    const startOfWeek = getStartOfWeek();
    const endOfWeek = getEndOfWeek();

    const menu = await db.collection('weeklymenus').findOne({
      userId: user._id,
      startDate: { $gte: startOfWeek },
      endDate: { $lte: endOfWeek }
    });

    if (!menu) {
      return res.status(404).json({ 
        error: 'No menu found for current week',
        hasMenu: false
      });
    }

    return res.status(200).json({
      success: true,
      menu,
      hasMenu: true
    });

  } catch (error) {
    console.error('Error getting current menu:', error);
    return res.status(500).json({
      error: 'Failed to get current menu',
      message: error.message
    });
  }
};
