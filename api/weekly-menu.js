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
    } else if (pathname.includes('/generate-meal')) {
      return await handleGenerateSingleMeal(req, res);
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

// Pre-defined meal templates for instant generation
const MEAL_TEMPLATES = {
  breakfast: [
    {
      name: "Overnight Oats with Berries",
      description: "Creamy oats soaked overnight with fresh berries and almond butter",
      prepTime: 10,
      cookTime: 0,
      servings: 2,
      difficulty: "Easy",
      calories: 350,
      protein: 12,
      carbs: 55,
      fat: 10,
      fiber: 8,
      ingredients: [
        { name: "Rolled oats", quantity: "1 cup", category: "grains" },
        { name: "Almond milk", quantity: "1.5 cups", category: "dairy-alternatives" },
        { name: "Mixed berries", quantity: "1 cup", category: "fruits" },
        { name: "Almond butter", quantity: "2 tbsp", category: "protein" },
        { name: "Maple syrup", quantity: "1 tbsp", category: "sweeteners" },
        { name: "Chia seeds", quantity: "1 tbsp", category: "seeds" }
      ],
      instructions: [
        "Mix oats, almond milk, and chia seeds in a jar",
        "Refrigerate overnight or for at least 4 hours",
        "Top with berries, almond butter, and maple syrup before serving"
      ],
      tags: ["vegan", "healthy", "no-cook", "make-ahead"],
      cuisine: "International"
    },
    {
      name: "Tofu Scramble with Vegetables",
      description: "Protein-packed scrambled tofu with colorful veggies and spices",
      prepTime: 10,
      cookTime: 15,
      servings: 2,
      difficulty: "Easy",
      calories: 280,
      protein: 18,
      carbs: 20,
      fat: 14,
      fiber: 6,
      ingredients: [
        { name: "Firm tofu", quantity: "14 oz", category: "protein" },
        { name: "Bell peppers", quantity: "1 cup", category: "vegetables" },
        { name: "Spinach", quantity: "2 cups", category: "vegetables" },
        { name: "Onion", quantity: "1/2 cup", category: "vegetables" },
        { name: "Turmeric", quantity: "1 tsp", category: "spices" },
        { name: "Nutritional yeast", quantity: "2 tbsp", category: "seasonings" },
        { name: "Olive oil", quantity: "1 tbsp", category: "oils" }
      ],
      instructions: [
        "Crumble tofu into a bowl",
        "Sauté onions and peppers in olive oil for 5 minutes",
        "Add tofu, turmeric, and nutritional yeast",
        "Cook for 8-10 minutes, stirring occasionally",
        "Add spinach and cook until wilted",
        "Season with salt and pepper to taste"
      ],
      tags: ["vegan", "high-protein", "savory"],
      cuisine: "American"
    }
  ],
  lunch: [
    {
      name: "Buddha Bowl with Tahini Dressing",
      description: "Colorful bowl with quinoa, roasted vegetables, and creamy tahini sauce",
      prepTime: 15,
      cookTime: 25,
      servings: 2,
      difficulty: "Medium",
      calories: 480,
      protein: 16,
      carbs: 62,
      fat: 18,
      fiber: 12,
      ingredients: [
        { name: "Quinoa", quantity: "1 cup", category: "grains" },
        { name: "Sweet potato", quantity: "1 large", category: "vegetables" },
        { name: "Chickpeas", quantity: "1 can", category: "protein" },
        { name: "Kale", quantity: "2 cups", category: "vegetables" },
        { name: "Tahini", quantity: "3 tbsp", category: "sauces" },
        { name: "Lemon juice", quantity: "2 tbsp", category: "condiments" },
        { name: "Avocado", quantity: "1", category: "fruits" }
      ],
      instructions: [
        "Cook quinoa according to package directions",
        "Roast sweet potato cubes at 400°F for 25 minutes",
        "Drain and rinse chickpeas, then roast with spices",
        "Massage kale with a bit of olive oil",
        "Mix tahini with lemon juice and water for dressing",
        "Assemble bowl with all ingredients and drizzle with dressing"
      ],
      tags: ["vegan", "healthy", "balanced", "meal-prep"],
      cuisine: "Mediterranean"
    },
    {
      name: "Lentil and Vegetable Soup",
      description: "Hearty soup packed with lentils, vegetables, and aromatic spices",
      prepTime: 10,
      cookTime: 30,
      servings: 4,
      difficulty: "Easy",
      calories: 320,
      protein: 18,
      carbs: 52,
      fat: 4,
      fiber: 16,
      ingredients: [
        { name: "Red lentils", quantity: "1.5 cups", category: "protein" },
        { name: "Carrots", quantity: "2 large", category: "vegetables" },
        { name: "Celery", quantity: "2 stalks", category: "vegetables" },
        { name: "Tomatoes", quantity: "1 can", category: "vegetables" },
        { name: "Vegetable broth", quantity: "6 cups", category: "liquids" },
        { name: "Cumin", quantity: "1 tsp", category: "spices" },
        { name: "Garlic", quantity: "3 cloves", category: "aromatics" }
      ],
      instructions: [
        "Sauté garlic, carrots, and celery in a large pot",
        "Add lentils, tomatoes, broth, and spices",
        "Bring to a boil, then simmer for 25-30 minutes",
        "Season with salt and pepper",
        "Serve hot with crusty bread"
      ],
      tags: ["vegan", "comfort-food", "high-protein", "budget-friendly"],
      cuisine: "Mediterranean"
    }
  ],
  dinner: [
    {
      name: "Thai Green Curry with Tofu",
      description: "Aromatic curry with vegetables, tofu, and coconut milk",
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      difficulty: "Medium",
      calories: 420,
      protein: 16,
      carbs: 45,
      fat: 20,
      fiber: 8,
      ingredients: [
        { name: "Firm tofu", quantity: "14 oz", category: "protein" },
        { name: "Green curry paste", quantity: "3 tbsp", category: "sauces" },
        { name: "Coconut milk", quantity: "1 can", category: "dairy-alternatives" },
        { name: "Bell peppers", quantity: "2", category: "vegetables" },
        { name: "Bamboo shoots", quantity: "1 cup", category: "vegetables" },
        { name: "Thai basil", quantity: "1/2 cup", category: "herbs" },
        { name: "Jasmine rice", quantity: "2 cups cooked", category: "grains" }
      ],
      instructions: [
        "Press and cube tofu, then pan-fry until golden",
        "Sauté curry paste in a large pan for 1 minute",
        "Add coconut milk and bring to a simmer",
        "Add vegetables and cook for 10 minutes",
        "Add tofu and Thai basil",
        "Serve over jasmine rice"
      ],
      tags: ["vegan", "spicy", "asian", "flavorful"],
      cuisine: "Thai"
    },
    {
      name: "Mushroom and Lentil Bolognese",
      description: "Rich and hearty pasta sauce with mushrooms and lentils",
      prepTime: 10,
      cookTime: 35,
      servings: 4,
      difficulty: "Easy",
      calories: 480,
      protein: 20,
      carbs: 72,
      fat: 10,
      fiber: 14,
      ingredients: [
        { name: "Brown lentils", quantity: "1 cup", category: "protein" },
        { name: "Mushrooms", quantity: "8 oz", category: "vegetables" },
        { name: "Crushed tomatoes", quantity: "28 oz", category: "vegetables" },
        { name: "Onion", quantity: "1 large", category: "vegetables" },
        { name: "Garlic", quantity: "4 cloves", category: "aromatics" },
        { name: "Italian herbs", quantity: "2 tsp", category: "spices" },
        { name: "Whole wheat pasta", quantity: "12 oz", category: "grains" }
      ],
      instructions: [
        "Cook lentils according to package directions",
        "Sauté onion and garlic until fragrant",
        "Add chopped mushrooms and cook until browned",
        "Add tomatoes, cooked lentils, and herbs",
        "Simmer for 20 minutes",
        "Cook pasta and serve with sauce"
      ],
      tags: ["vegan", "comfort-food", "italian", "family-friendly"],
      cuisine: "Italian"
    }
  ]
};

async function handleGenerateSingleMeal(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firebaseUid, day, mealType, menuId } = req.body;

  if (!firebaseUid || !day || !mealType) {
    return res.status(400).json({ error: 'Firebase UID, day, and mealType are required' });
  }

  const client = await connectToDatabase();
  const db = client.db('vegan-diet-app');
  const usersCollection = db.collection('users');
  const weeklyMenusCollection = db.collection('weeklymenus');

  const user = await usersCollection.findOne({ firebaseUid });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    // Get random template for this meal type
    const templates = MEAL_TEMPLATES[mealType] || MEAL_TEMPLATES.lunch;
    const randomIndex = Math.floor(Math.random() * templates.length);
    const template = templates[randomIndex];

    const meal = {
      _id: new ObjectId(),
      ...template,
      isVegan: true,
      mealType: mealType
    };

    // Find or create menu
    let finalMenuId = menuId;
    
    if (menuId) {
      await weeklyMenusCollection.updateOne(
        { _id: new ObjectId(menuId), userId: firebaseUid },
        { $set: { [`menu.${day}.${mealType}`]: meal } }
      );
    } else {
      const existingMenu = await weeklyMenusCollection.findOne({
        userId: firebaseUid,
        weekStart: { $lte: new Date() },
        weekEnd: { $gte: new Date() }
      });

      if (existingMenu) {
        await weeklyMenusCollection.updateOne(
          { _id: existingMenu._id },
          { $set: { [`menu.${day}.${mealType}`]: meal } }
        );
        finalMenuId = existingMenu._id.toString();
      } else {
        const newMenu = {
          userId: firebaseUid,
          weekStart: new Date(),
          weekEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          menu: {},
          createdAt: new Date()
        };
        
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        for (const d of days) {
          newMenu.menu[d] = {};
        }
        newMenu.menu[day][mealType] = meal;
        
        const result = await weeklyMenusCollection.insertOne(newMenu);
        finalMenuId = result.insertedId.toString();
      }
    }

    return res.status(200).json({ meal, day, mealType, menuId: finalMenuId });

  } catch (error) {
    console.error(`Error generating ${mealType} for ${day}:`, error.message);
    return res.status(500).json({ error: error.message });
  }
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

  // Generate all meals in parallel to avoid timeout (Vercel has 10s limit)
  const generateMeal = async (day, mealType) => {
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
          },
          timeout: 8000 // 8 second timeout per request
        }
      );

      const responseText = response.data.choices[0].message.content.trim();
      
      // Clean up response - remove markdown if present
      let cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Parse the JSON
      const recipe = JSON.parse(cleanedText);
      
      return {
        day,
        mealType,
        meal: {
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
        }
      };
    } catch (error) {
      console.error(`Error generating ${mealType} for ${day}:`, error.message);
      
      // Fallback meal if API fails
      return {
        day,
        mealType,
        meal: {
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
        }
      };
    }
  };

  // Create all meal generation promises
  const mealPromises = [];
  for (const day of days) {
    for (const mealType of mealTypes) {
      mealPromises.push(generateMeal(day, mealType));
    }
  }

  // Generate all meals in parallel
  const generatedMeals = await Promise.all(mealPromises);

  // Organize meals by day
  for (const day of days) {
    weeklyMenu.menu[day] = {};
  }

  for (const { day, mealType, meal } of generatedMeals) {
    weeklyMenu.menu[day][mealType] = meal;
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
