const { MongoClient } = require('mongodb');

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
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (pathname.includes('/nearby')) {
      return await handleNearby(req, res);
    } else if (pathname.includes('/recommendations-for-dish')) {
      return await handleRecommendations(req, res);
    } else {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Error in stores API:', error);
    return res.status(500).json({ error: error.message });
  }
};

async function handleNearby(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const lat = parseFloat(url.searchParams.get('lat'));
  const lng = parseFloat(url.searchParams.get('lng'));
  const radius = parseInt(url.searchParams.get('radius')) || 5000;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const client = await connectToDatabase();
  const db = client.db('vegan-diet-app');
  const storesCollection = db.collection('stores');

  const stores = await storesCollection.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: radius
      }
    }
  }).limit(50).toArray();

  return res.status(200).json({ stores, count: stores.length });
}

async function handleRecommendations(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { dishId, userLocation } = req.body;

  if (!dishId || !userLocation) {
    return res.status(400).json({ error: 'Dish ID and user location are required' });
  }

  const client = await connectToDatabase();
  const db = client.db('vegan-diet-app');
  const dishesCollection = db.collection('dishes');
  const storesCollection = db.collection('stores');

  const dish = await dishesCollection.findOne({ _id: dishId });

  if (!dish) {
    return res.status(404).json({ error: 'Dish not found' });
  }

  const ingredientNames = dish.ingredients.map(ing => ing.name.toLowerCase());

  const stores = await storesCollection.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [userLocation.lng, userLocation.lat]
        },
        $maxDistance: 10000
      }
    }
  }).limit(20).toArray();

  const recommendations = stores.map(store => ({
    store,
    matchedIngredients: ingredientNames.filter(ing => 
      store.name.toLowerCase().includes('market') || 
      store.name.toLowerCase().includes('grocery')
    ),
    distance: calculateDistance(userLocation, {
      lat: store.location.coordinates[1],
      lng: store.location.coordinates[0]
    })
  }));

  return res.status(200).json({ recommendations });
}

function calculateDistance(loc1, loc2) {
  const R = 6371;
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
