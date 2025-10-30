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
    const dishesCollection = db.collection('dishes');

    // GET all dishes
    if (req.method === 'GET') {
      const { 
        search, 
        cuisine, 
        mealType, 
        isVegan,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const query = {};
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (cuisine) query.cuisine = cuisine;
      if (mealType) query.mealType = mealType;
      if (isVegan !== undefined) query.isVegan = isVegan === 'true';

      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const dishes = await dishesCollection
        .find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      const total = await dishesCollection.countDocuments(query);

      return res.status(200).json({
        dishes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    }

    // POST create dish
    if (req.method === 'POST') {
      const dishData = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await dishesCollection.insertOne(dishData);
      const dish = await dishesCollection.findOne({ _id: result.insertedId });

      return res.status(201).json(dish);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in dishes API:', error);
    return res.status(500).json({ error: error.message });
  }
};
