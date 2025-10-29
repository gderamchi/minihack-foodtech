const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, description, ingredients, cuisine } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Dish name is required' });
    }

    // Create prompt for Blackbox API
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

    prompt += `\nPlease provide a complete vegan alternative with:\n`;
    prompt += `1. A creative vegan dish name\n`;
    prompt += `2. A detailed description\n`;
    prompt += `3. Complete list of vegan ingredients with quantities\n`;
    prompt += `4. Step-by-step cooking instructions\n`;
    prompt += `5. Preparation time and cooking time\n`;
    prompt += `6. Number of servings\n`;
    prompt += `7. Difficulty level (easy/medium/hard)\n`;
    prompt += `8. Nutritional information (approximate calories, protein, carbs, fat per serving)\n\n`;
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
