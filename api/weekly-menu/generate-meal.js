const admin = require('firebase-admin');
const { MongoClient, ObjectId } = require('mongodb');

// Initialize Firebase Admin (safe for serverless - checks if already initialized)
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing Firebase Admin credentials in environment variables');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
    
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('CRITICAL: Firebase initialization error:', error.message);
    throw error;
  }
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!admin.apps.length) {
      console.error('Firebase Admin not initialized');
      return res.status(500).json({ error: 'Firebase Admin initialization failed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (authError) {
      console.error('Token verification error:', authError);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { firebaseUid, day, mealType, menuId } = req.body;

    if (!firebaseUid || !day || !mealType) {
      return res.status(400).json({ error: 'Firebase UID, day, and mealType are required' });
    }

    if (decodedToken.uid !== firebaseUid) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const client = await connectToDatabase();
    const db = client.db('vegan-diet-app');
    const usersCollection = db.collection('users');
    const weeklyMenusCollection = db.collection('weeklymenus');

    const user = await usersCollection.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Use Blackbox AI with Claude Sonnet 4.5
    const axios = require('axios');
    const blackboxApiKey = process.env.BLACKBOX_API_KEY;
    const blackboxApiUrl = process.env.BLACKBOX_API_URL || 'https://api.blackbox.ai/chat/completions';
    const model = 'blackboxai/anthropic/claude-sonnet-4.5';

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
          timeout: 8000
        }
      );

      const responseText = response.data.choices[0].message.content.trim();
      let cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const recipe = JSON.parse(cleanedText);

      const meal = {
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

      // If menuId provided, update existing menu; otherwise create/update menu
      let finalMenuId = menuId;
      
      if (menuId) {
        await weeklyMenusCollection.updateOne(
          { _id: new ObjectId(menuId), userId: firebaseUid },
          { $set: { [`menu.${day}.${mealType}`]: meal } }
        );
      } else {
        // Find or create menu for this week
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
          // Create new menu structure
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
      
      // Return fallback meal
      const fallbackMeal = {
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

      return res.status(200).json({ meal: fallbackMeal, day, mealType, fallback: true });
    }
  } catch (error) {
    console.error('Error in generate-meal:', error);
    return res.status(500).json({ error: error.message });
  }
};
