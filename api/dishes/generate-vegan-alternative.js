const axios = require('axios');
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
    const { name, description, ingredients, cuisine, firebaseUid } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Dish name is required' });
    }

    // Fetch user profile if firebaseUid is provided
    let userProfile = null;
    if (firebaseUid) {
      try {
        const db = await connectToDatabase();
        userProfile = await db.collection('users').findOne({ firebaseUid });
      } catch (error) {
        console.log('Could not fetch user profile:', error.message);
      }
    }

    // Create personalized prompt for Blackbox API
    let prompt = `I need a vegan alternative for the following dish:\n\n`;
    prompt += `Dish Name: ${name}\n`;
    if (description) prompt += `Description: ${description}\n`;
    if (cuisine) prompt += `Cuisine: ${cuisine}\n`;
    
    if (ingredients && ingredients.length > 0) {
      prompt += `\nOriginal Ingredients:\n`;
      ingredients.forEach(ing => {
        prompt += `- ${ing.name || ing}${ing.quantity ? ` (${ing.quantity})` : ''}\n`;
      });
    }

    // Add user preferences to prompt
    if (userProfile && userProfile.onboardingData) {
      const prefs = userProfile.onboardingData;
      
      prompt += `\n=== USER PREFERENCES (IMPORTANT - MUST FOLLOW) ===\n`;
      
      // Dietary restrictions & allergies
      if (prefs.dietary?.restrictions?.length > 0) {
        prompt += `\nDIETARY RESTRICTIONS (MUST AVOID):\n`;
        prefs.dietary.restrictions.forEach(r => prompt += `- ${r}\n`);
      }
      
      if (prefs.dietary?.allergies?.length > 0) {
        prompt += `\nALLERGIES (ABSOLUTELY MUST AVOID):\n`;
        prefs.dietary.allergies.forEach(a => prompt += `- ${a}\n`);
      }

      if (prefs.dietary?.intolerances?.length > 0) {
        prompt += `\nINTOLERANCES (AVOID IF POSSIBLE):\n`;
        prefs.dietary.intolerances.forEach(i => prompt += `- ${i}\n`);
      }
      
      // Food preferences
      if (prefs.foodPreferences) {
        if (prefs.foodPreferences.favoriteCuisines?.length > 0) {
          prompt += `\nFAVORITE CUISINES: ${prefs.foodPreferences.favoriteCuisines.join(', ')}\n`;
        }
        
        if (prefs.foodPreferences.dislikedIngredients?.length > 0) {
          prompt += `\nDISLIKED INGREDIENTS (AVOID): ${prefs.foodPreferences.dislikedIngredients.join(', ')}\n`;
        }
        
        if (prefs.foodPreferences.preferredIngredients?.length > 0) {
          prompt += `\nPREFERRED INGREDIENTS (USE WHEN POSSIBLE): ${prefs.foodPreferences.preferredIngredients.join(', ')}\n`;
        }
        
        if (prefs.foodPreferences.spiceTolerance) {
          prompt += `\nSPICE TOLERANCE: ${prefs.foodPreferences.spiceTolerance}\n`;
        }
        
        if (prefs.foodPreferences.texturePreferences?.length > 0) {
          prompt += `\nPREFERRED TEXTURES: ${prefs.foodPreferences.texturePreferences.join(', ')}\n`;
        }
        
        if (prefs.foodPreferences.flavorProfiles?.length > 0) {
          prompt += `\nPREFERRED FLAVORS: ${prefs.foodPreferences.flavorProfiles.join(', ')}\n`;
        }
      }
      
      // Cooking preferences
      if (prefs.cooking) {
        if (prefs.cooking.skillLevel) {
          prompt += `\nCOOKING SKILL LEVEL: ${prefs.cooking.skillLevel}\n`;
        }
        
        if (prefs.cooking.timeAvailable) {
          prompt += `\nMAX COOKING TIME: ${prefs.cooking.timeAvailable} minutes\n`;
        }
        
        if (prefs.cooking.equipment?.length > 0) {
          prompt += `\nAVAILABLE EQUIPMENT: ${prefs.cooking.equipment.join(', ')}\n`;
        }
      }
      
      // Health goals
      if (prefs.health) {
        if (prefs.health.primaryGoal) {
          prompt += `\nHEALTH GOAL: ${prefs.health.primaryGoal}\n`;
        }
        
        if (prefs.health.calorieTarget) {
          prompt += `\nCALORIE TARGET PER MEAL: ~${Math.round(prefs.health.calorieTarget / 3)} calories\n`;
        }
        
        if (prefs.health.macroPreferences) {
          prompt += `\nMACRO PREFERENCE: ${prefs.health.macroPreferences}\n`;
        }
      }
      
      // Household size
      if (prefs.personal?.householdSize) {
        prompt += `\nSERVINGS NEEDED: ${prefs.personal.householdSize}\n`;
      }
      
      // Additional notes
      if (prefs.additionalNotes) {
        prompt += `\nADDITIONAL USER NOTES: ${prefs.additionalNotes}\n`;
      }
      
      prompt += `\n=== END USER PREFERENCES ===\n`;
    }

    prompt += `\nPlease provide a complete vegan alternative that STRICTLY FOLLOWS the user's preferences above:\n`;
    prompt += `1. A creative vegan dish name\n`;
    prompt += `2. A detailed description\n`;
    prompt += `3. Complete list of vegan ingredients with quantities (AVOID all allergens and restrictions)\n`;
    prompt += `4. Step-by-step cooking instructions (match skill level and time constraints)\n`;
    prompt += `5. Preparation time and cooking time\n`;
    prompt += `6. Number of servings (match household size if provided)\n`;
    prompt += `7. Difficulty level (match user's skill level)\n`;
    prompt += `8. Nutritional information (match calorie target if provided)\n\n`;
    prompt += `Format your response as JSON with this structure:\n`;
    prompt += `{\n`;
    prompt += `  "name": "vegan dish name",\n`;
    prompt += `  "description": "detailed description",\n`;
    prompt += `  "ingredients": [{"name": "ingredient", "quantity": "amount"}],\n`;
    prompt += `  "instructions": ["step 1", "step 2", ...],\n`;
    prompt += `  "prepTime": minutes,\n`;
    prompt += `  "cookTime": minutes,\n`;
    prompt += `  "servings": number,\n`;
    prompt += `  "difficulty": "easy/medium/hard",\n`;
    prompt += `  "nutritionalInfo": {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}\n`;
    prompt += `}`;

    // Call Blackbox API
    const response = await axios.post(
      'https://api.blackbox.ai/chat/completions',
      {
        model: 'blackboxai/anthropic/claude-sonnet-4.5',
        messages: [
          {
            role: 'system',
            content: 'You are a professional vegan chef and nutritionist. Create delicious, nutritious vegan alternatives to non-vegan dishes. Always respond with valid JSON.'
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
          'Authorization': `Bearer ${process.env.BLACKBOX_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    
    // Try to parse JSON from response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.status(200).json({
        success: true,
        veganDish: {
          ...parsed,
          isVegan: true,
          generatedByAI: true,
          source: 'ai-generated',
          originalDish: name
        }
      });
    }
    
    // Fallback if JSON parsing fails
    return res.status(200).json({
      success: true,
      veganDish: {
        name: `Vegan ${name}`,
        description: aiResponse,
        ingredients: [],
        instructions: [aiResponse],
        prepTime: 30,
        cookTime: 30,
        servings: 4,
        difficulty: 'medium',
        isVegan: true,
        generatedByAI: true,
        source: 'ai-generated'
      }
    });

  } catch (error) {
    console.error('Error generating vegan alternative:', error.response?.data || error.message);
    return res.status(500).json({
      error: 'Failed to generate vegan alternative',
      message: error.message,
      details: error.response?.data
    });
  }
};
