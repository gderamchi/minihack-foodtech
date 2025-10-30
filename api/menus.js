const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedClient = client;
  return client;
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('vegan-diet-app');
    const menusCollection = db.collection('menus');

    // GET all menus
    if (req.method === 'GET') {
      const { type, cuisine, occasion, page = 1, limit = 20 } = req.query;
      
      const query = {};
      if (type) query.type = type;
      if (cuisine) query.cuisine = cuisine;
      if (occasion) query.occasion = occasion;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const menus = await menusCollection
        .find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      const total = await menusCollection.countDocuments(query);

      return res.status(200).json({
        menus,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    }

    // POST create menu
    if (req.method === 'POST') {
      const menuData = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await menusCollection.insertOne(menuData);
      const menu = await menusCollection.findOne({ _id: result.insertedId });

      return res.status(201).json(menu);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in menus API:', error);
    return res.status(500).json({ error: error.message });
  }
};
