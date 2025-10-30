const admin = require('firebase-admin');
const { MongoClient, ObjectId } = require('mongodb');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

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
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (pathname.includes('/current')) {
      return await handleCurrent(req, res, admin);
    } else if (pathname.includes('/generate')) {
      return await handleGenerate(req, res, admin);
    } else if (pathname.includes('/swap-meal')) {
      return await handleSwapMeal(req, res, admin);
    } else if (pathname.includes('/shopping-list')) {
      return await handleShoppingList(req, res, admin);
    } else {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Error in weekly-menu API:', error);
    return res.status(500).json({ error: error.message });
  }
};

async function handleCurrent(req, res, admin) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const firebaseUid = url.searchParams.get('firebaseUid');

  if (!firebaseUid) {
    return res.status(400).json({ error: 'Firebase UID is required' });
  }

  const client = await connectToDatabase();
  const db = client.db('vegan-diet-app');
  const usersCollection = db.collection('users');
  const weeklyMenusCollection = db.collection('weeklymenus');

  const user = await usersCollection.findOne({ firebaseUid });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const currentMenu = await weeklyMenusCollection
    .find({ userId: firebaseUid })
    .sort({ createdAt: -1 })
    .limit(1)
    .toArray()
    .then(menus => menus[0]);

  if (!currentMenu) {
    return res.status(404).json({ error: 'No weekly menu found' });
  }

  return res.status(200).json({ menu: currentMenu });
}

async function handleGenerate(req, res, admin) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firebaseUid } = req.body;

  if (!firebaseUid) {
    return res.status(400).json({ error: 'Firebase UID is required' });
  }

  const client = await connectToDatabase();
  const db = client.db('vegan-diet-app');
  const usersCollection = db.collection('users');
  const dishesCollection = db.collection('dishes');
  const weeklyMenusCollection = db.collection('weeklymenus');

  const user = await usersCollection.findOne({ firebaseUid });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const dishes = await dishesCollection.find({ isVegan: true }).limit(21).toArray();

  const weeklyMenu = {
    userId: firebaseUid,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    days: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      meals: [
        { type: 'breakfast', dish: dishes[i * 3] },
        { type: 'lunch', dish: dishes[i * 3 + 1] },
        { type: 'dinner', dish: dishes[i * 3 + 2] }
      ]
    })),
    createdAt: new Date()
  };

  const result = await weeklyMenusCollection.insertOne(weeklyMenu);
  weeklyMenu._id = result.insertedId;

  return res.status(201).json({ menu: weeklyMenu });
}

async function handleSwapMeal(req, res, admin) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { menuId, dayIndex, mealIndex, firebaseUid } = req.body;

  if (!menuId || dayIndex === undefined || mealIndex === undefined || !firebaseUid) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const client = await connectToDatabase();
  const db = client.db('vegan-diet-app');
  const weeklyMenusCollection = db.collection('weeklymenus');
  const dishesCollection = db.collection('dishes');

  const menu = await weeklyMenusCollection.findOne({ 
    _id: new ObjectId(menuId),
    userId: firebaseUid 
  });

  if (!menu) {
    return res.status(404).json({ error: 'Menu not found' });
  }

  const currentMeal = menu.days[dayIndex].meals[mealIndex];
  const newDish = await dishesCollection.findOne({ 
    isVegan: true,
    _id: { $ne: new ObjectId(currentMeal.dish._id) }
  });

  if (!newDish) {
    return res.status(404).json({ error: 'No alternative dish found' });
  }

  await weeklyMenusCollection.updateOne(
    { _id: new ObjectId(menuId) },
    { $set: { [`days.${dayIndex}.meals.${mealIndex}.dish`]: newDish } }
  );

  const updatedMenu = await weeklyMenusCollection.findOne({ _id: new ObjectId(menuId) });

  return res.status(200).json({ menu: updatedMenu });
}

async function handleShoppingList(req, res, admin) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { menuId, firebaseUid } = req.body;

  if (!menuId || !firebaseUid) {
    return res.status(400).json({ error: 'Menu ID and Firebase UID are required' });
  }

  const client = await connectToDatabase();
  const db = client.db('vegan-diet-app');
  const weeklyMenusCollection = db.collection('weeklymenus');

  const menu = await weeklyMenusCollection.findOne({ 
    _id: new ObjectId(menuId),
    userId: firebaseUid 
  });

  if (!menu) {
    return res.status(404).json({ error: 'Menu not found' });
  }

  const ingredientsMap = new Map();

  menu.days.forEach(day => {
    day.meals.forEach(meal => {
      if (meal.dish && meal.dish.ingredients) {
        meal.dish.ingredients.forEach(ing => {
          const key = ing.name.toLowerCase();
          if (ingredientsMap.has(key)) {
            const existing = ingredientsMap.get(key);
            existing.quantity = `${existing.quantity} + ${ing.quantity}`;
          } else {
            ingredientsMap.set(key, { ...ing });
          }
        });
      }
    });
  });

  const shoppingList = Array.from(ingredientsMap.values());

  return res.status(200).json({ shoppingList });
}
