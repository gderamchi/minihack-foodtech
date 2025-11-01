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

  // Use Blackbox AI with Claude Sonnet 4.5 to generate personalized meals
  const axios = require('axios');
  const blackboxApiKey = process.env.BLACKBOX_API_KEY;
  const blackboxApiUrl = process.env.BLACKBOX_API_URL || 'https://api.blackbox.ai/chat/completions';
  const model = 'blackboxai/anthropic/claude-sonnet-4.5';

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

  // Build user context from questionnaire data
  const userContext = `
User Profile:
- Dietary preferences: ${user.preferences?.dietaryRestrictions?.join(', ') || 'None'}
- Allergies: ${user.preferences?.allergies?.join(', ') || 'None'}
- Favorite cuisines: ${user.preferences?.favoriteCuisines?.join(', ') || 'Various'}
- Cooking skill: ${user.preferences?.cookingSkill || 'Intermediate'}
- Time available: ${user.preferences?.cookingTime || '30-45 minutes'}
- Health goals: ${user.preferences?.healthGoals?.join(', ') || 'General wellness'}
- Budget: ${user.preferences?.budget || 'Moderate'}
`;

  // Generate meals one by one for each day
  for (const day of days) {
    weeklyMenu.menu[day] = {};
    
    for (const mealType of mealTypes) {
      try {
        const prompt = `You are a professional vegan chef and nutritionist. Generate a delicious, healthy vegan ${mealType} recipe personalized for this user.

${userContext}

Requirements:
- Must be 100% vegan (no animal products)
- Include complete nutritional information
- Provide detailed ingredients with quantities
- Include step-by-step cooking instructions
- Consider user's preferences and restrictions

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "name": "Recipe Name",
  "description": "Brief appetizing description",
  "prepTime": 15,
  "cookTime": 20,
  "servings": 2,
  "difficulty": "Easy",
  "calories": 400,
  "protein": 15,
  "carbs": 50,
  "fat": 12,
  "fiber": 8,
  "ingredients": [
    {"name": "ingredient name", "quantity": "1 cup", "category": "vegetables"}
  ],
  "instructions": [
    "Step 1",
    "Step 2"
  ],
  "tags": ["vegan", "healthy"],
  "cuisine": "International"
}`;

        const response = await axios.post(
          blackboxApiUrl,
          {
            model: model,
            messages: [
              {
                role: 'system',
                content: 'You are a professional vegan chef and nutritionist. Create delicious, nutritious vegan recipes with complete details.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2000,
            stream: false
          },
          {
            headers: {
              'Authorization': `Bearer ${blackboxApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const responseText = response.data.choices[0].message.content.trim();
        
        // Clean up response - remove markdown if present
        let cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        // Parse the JSON
        const recipe = JSON.parse(cleanedText);
        
        // Add to menu
        weeklyMenu.menu[day][mealType] = {
          _id: new ObjectId(),
          name: recipe.name,
          description: recipe.description,
          prepTime: parseInt(recipe.prepTime) || 15,
          cookTime: parseInt(recipe.cookTime) || 20,
          servings: parseInt(recipe.servings) || 2,
          difficulty: recipe.difficulty || 'Easy',
          calories: parseInt(recipe.calories) || 400,
          protein: parseInt(recipe.protein) || 15,
          carbs: parseInt(recipe.carbs) || 50,
          fat: parseInt(recipe.fat) || 12,
          fiber: parseInt(recipe.fiber) || 8,
          ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
          instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
          tags: Array.isArray(recipe.tags) ? recipe.tags : ['vegan', 'healthy'],
          cuisine: recipe.cuisine || 'International',
          isVegan: true,
          mealType: mealType
        };
        
      } catch (error) {
        console.error(`Error generating ${mealType} for ${day}:`, error.message);
        
        // Fallback meal if API fails
        weeklyMenu.menu[day][mealType] = {
          _id: new ObjectId(),
          name: `Vegan ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`,
          description: `A delicious vegan ${mealType}`,
          prepTime: 15,
          cookTime: 20,
          servings: 2,
          difficulty: 'Easy',
          calories: mealType === 'breakfast' ? 350 : mealType === 'lunch' ? 500 : 600,
          protein: 15,
          carbs: 50,
          fat: 12,
          fiber: 8,
          ingredients: [
            { name: 'Mixed vegetables', quantity: '2 cups', category: 'vegetables' },
            { name: 'Whole grains', quantity: '1 cup', category: 'grains' },
            { name: 'Plant protein', quantity: '1/2 cup', category: 'protein' }
          ],
          instructions: [
            'Prepare ingredients',
            'Cook according to preference',
            'Season and serve'
          ],
          tags: ['vegan', 'healthy'],
          cuisine: 'International',
          isVegan: true,
          mealType: mealType
        };
      }
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
