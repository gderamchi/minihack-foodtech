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
      return await handleCurrent(req, res);
    } else if (pathname.includes('/generate')) {
      return await handleGenerate(req, res);
    } else if (pathname.includes('/swap-meal')) {
      return await handleSwapMeal(req, res);
    } else if (pathname.includes('/shopping-list')) {
      return await handleShoppingList(req, res);
    } else {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Error in weekly-menu API:', error);
    return res.status(500).json({ error: error.message });
  }
};

async function handleCurrent(req, res) {
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

async function handleGenerate(req, res) {
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
  const weeklyMenusCollection = db.collection('weeklymenus');

  const user = await usersCollection.findOne({ firebaseUid });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Pre-defined vegan meal templates (fast generation, no API calls)
  const mealTemplates = {
    breakfast: [
      {
        name: 'Overnight Oats with Berries',
        description: 'Creamy oats soaked overnight with fresh berries and almond milk',
        prepTime: 10,
        cookTime: 0,
        servings: 2,
        difficulty: 'Easy',
        calories: 350,
        protein: 12,
        carbs: 58,
        fat: 8,
        fiber: 10,
        ingredients: [
          { name: 'Rolled oats', quantity: '1 cup', category: 'grains' },
          { name: 'Almond milk', quantity: '1.5 cups', category: 'dairy-alternatives' },
          { name: 'Mixed berries', quantity: '1 cup', category: 'fruits' },
          { name: 'Chia seeds', quantity: '2 tbsp', category: 'seeds' },
          { name: 'Maple syrup', quantity: '1 tbsp', category: 'sweeteners' }
        ],
        instructions: [
          'Mix oats, almond milk, and chia seeds in a jar',
          'Refrigerate overnight',
          'Top with berries and maple syrup before serving'
        ],
        tags: ['vegan', 'healthy', 'no-cook'],
        cuisine: 'International'
      },
      {
        name: 'Avocado Toast with Tomatoes',
        description: 'Whole grain toast topped with mashed avocado and fresh tomatoes',
        prepTime: 5,
        cookTime: 5,
        servings: 2,
        difficulty: 'Easy',
        calories: 320,
        protein: 10,
        carbs: 42,
        fat: 14,
        fiber: 12,
        ingredients: [
          { name: 'Whole grain bread', quantity: '4 slices', category: 'grains' },
          { name: 'Avocado', quantity: '2 medium', category: 'vegetables' },
          { name: 'Cherry tomatoes', quantity: '1 cup', category: 'vegetables' },
          { name: 'Lemon juice', quantity: '1 tbsp', category: 'condiments' },
          { name: 'Salt and pepper', quantity: 'to taste', category: 'spices' }
        ],
        instructions: [
          'Toast the bread',
          'Mash avocados with lemon juice, salt, and pepper',
          'Spread on toast and top with sliced tomatoes'
        ],
        tags: ['vegan', 'quick', 'healthy'],
        cuisine: 'International'
      }
    ],
    lunch: [
      {
        name: 'Buddha Bowl with Tahini Dressing',
        description: 'Colorful bowl with quinoa, roasted vegetables, and creamy tahini',
        prepTime: 15,
        cookTime: 25,
        servings: 2,
        difficulty: 'Medium',
        calories: 480,
        protein: 18,
        carbs: 62,
        fat: 18,
        fiber: 14,
        ingredients: [
          { name: 'Quinoa', quantity: '1 cup', category: 'grains' },
          { name: 'Sweet potato', quantity: '1 large', category: 'vegetables' },
          { name: 'Chickpeas', quantity: '1 can', category: 'protein' },
          { name: 'Kale', quantity: '2 cups', category: 'vegetables' },
          { name: 'Tahini', quantity: '3 tbsp', category: 'condiments' }
        ],
        instructions: [
          'Cook quinoa according to package',
          'Roast sweet potato and chickpeas at 400°F for 25 minutes',
          'Massage kale with lemon juice',
          'Assemble bowl and drizzle with tahini dressing'
        ],
        tags: ['vegan', 'nutritious', 'filling'],
        cuisine: 'Mediterranean'
      },
      {
        name: 'Veggie Wrap with Hummus',
        description: 'Fresh vegetables wrapped in a whole wheat tortilla with creamy hummus',
        prepTime: 10,
        cookTime: 0,
        servings: 2,
        difficulty: 'Easy',
        calories: 420,
        protein: 15,
        carbs: 58,
        fat: 14,
        fiber: 12,
        ingredients: [
          { name: 'Whole wheat tortillas', quantity: '2 large', category: 'grains' },
          { name: 'Hummus', quantity: '1/2 cup', category: 'protein' },
          { name: 'Mixed greens', quantity: '2 cups', category: 'vegetables' },
          { name: 'Cucumber', quantity: '1 medium', category: 'vegetables' },
          { name: 'Bell peppers', quantity: '1 cup', category: 'vegetables' }
        ],
        instructions: [
          'Spread hummus on tortillas',
          'Layer with greens, cucumber, and peppers',
          'Roll tightly and slice in half'
        ],
        tags: ['vegan', 'quick', 'portable'],
        cuisine: 'Mediterranean'
      }
    ],
    dinner: [
      {
        name: 'Lentil Curry with Rice',
        description: 'Aromatic curry with red lentils, coconut milk, and warming spices',
        prepTime: 10,
        cookTime: 30,
        servings: 2,
        difficulty: 'Medium',
        calories: 520,
        protein: 22,
        carbs: 78,
        fat: 14,
        fiber: 16,
        ingredients: [
          { name: 'Red lentils', quantity: '1 cup', category: 'protein' },
          { name: 'Coconut milk', quantity: '1 can', category: 'dairy-alternatives' },
          { name: 'Curry powder', quantity: '2 tbsp', category: 'spices' },
          { name: 'Brown rice', quantity: '1 cup', category: 'grains' },
          { name: 'Spinach', quantity: '2 cups', category: 'vegetables' }
        ],
        instructions: [
          'Cook rice according to package',
          'Sauté curry powder in oil',
          'Add lentils, coconut milk, and water',
          'Simmer 20 minutes, add spinach',
          'Serve over rice'
        ],
        tags: ['vegan', 'comfort-food', 'protein-rich'],
        cuisine: 'Indian'
      },
      {
        name: 'Pasta Primavera',
        description: 'Whole wheat pasta with seasonal vegetables in garlic olive oil',
        prepTime: 10,
        cookTime: 20,
        servings: 2,
        difficulty: 'Easy',
        calories: 480,
        protein: 16,
        carbs: 72,
        fat: 14,
        fiber: 12,
        ingredients: [
          { name: 'Whole wheat pasta', quantity: '8 oz', category: 'grains' },
          { name: 'Broccoli', quantity: '2 cups', category: 'vegetables' },
          { name: 'Cherry tomatoes', quantity: '1 cup', category: 'vegetables' },
          { name: 'Garlic', quantity: '4 cloves', category: 'vegetables' },
          { name: 'Olive oil', quantity: '3 tbsp', category: 'oils' }
        ],
        instructions: [
          'Cook pasta according to package',
          'Sauté garlic in olive oil',
          'Add broccoli and tomatoes, cook until tender',
          'Toss with pasta and season'
        ],
        tags: ['vegan', 'italian', 'family-friendly'],
        cuisine: 'Italian'
      }
    ]
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'];
  
  const weeklyMenu = {
    userId: firebaseUid,
    weekStart: new Date(),
    weekEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    menu: {},
    nutritionSummary: {
      daily: {
        calories: 2000,
        protein: 60,
        carbs: 250,
        fat: 65,
        fiber: 30
      }
    },
    createdAt: new Date()
  };

  // Generate meals for each day using templates
  for (const day of days) {
    weeklyMenu.menu[day] = {};
    
    for (const mealType of mealTypes) {
      // Randomly select a template for variety
      const templates = mealTemplates[mealType];
      const randomIndex = Math.floor(Math.random() * templates.length);
      const template = templates[randomIndex];
      
      weeklyMenu.menu[day][mealType] = {
        _id: new ObjectId(),
        ...template,
        isVegan: true,
        mealType: mealType
      };
    }
  }

  const result = await weeklyMenusCollection.insertOne(weeklyMenu);
  weeklyMenu._id = result.insertedId;

  return res.status(201).json({ menu: weeklyMenu });
}

async function handleSwapMeal(req, res) {
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

async function handleShoppingList(req, res) {
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
