const axios = require('axios');

class BlackboxService {
  constructor() {
    this.apiKey = process.env.BLACKBOX_API_KEY;
    this.apiUrl = process.env.BLACKBOX_API_URL || 'https://api.blackbox.ai/chat/completions';
    this.model = 'blackboxai/anthropic/claude-sonnet-4.5';
  }

  /**
   * Generate a vegan alternative for a non-vegan dish
   * @param {Object} dishData - Original dish information
   * @returns {Object} Vegan alternative dish
   */
  async generateVeganAlternative(dishData) {
    try {
      const prompt = this.createVeganAlternativePrompt(dishData);
      
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional vegan chef and nutritionist. Your task is to create delicious, nutritious vegan alternatives to non-vegan dishes. Provide detailed recipes with ingredients, instructions, and nutritional information.'
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
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      return this.parseVeganAlternativeResponse(aiResponse, dishData);
    } catch (error) {
      console.error('Blackbox API Error:', error.response?.data || error.message);
      throw new Error('Failed to generate vegan alternative');
    }
  }

  /**
   * Create a prompt for generating vegan alternatives
   */
  createVeganAlternativePrompt(dishData) {
    const { name, description, ingredients, cuisine } = dishData;
    
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
    prompt += `8. Nutritional information (approximate calories, protein, carbs, fat per serving)\n`;
    prompt += `9. Any helpful tips or variations\n\n`;
    prompt += `Format your response as JSON with the following structure:\n`;
    prompt += `{\n`;
    prompt += `  "name": "vegan dish name",\n`;
    prompt += `  "description": "detailed description",\n`;
    prompt += `  "ingredients": [{"name": "ingredient", "quantity": "amount"}],\n`;
    prompt += `  "instructions": ["step 1", "step 2", ...],\n`;
    prompt += `  "prepTime": minutes,\n`;
    prompt += `  "cookTime": minutes,\n`;
    prompt += `  "servings": number,\n`;
    prompt += `  "difficulty": "easy/medium/hard",\n`;
    prompt += `  "nutritionalInfo": {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0},\n`;
    prompt += `  "tips": "helpful tips"\n`;
    prompt += `}`;

    return prompt;
  }

  /**
   * Parse the AI response and structure it
   */
  parseVeganAlternativeResponse(aiResponse, originalDish) {
    try {
      console.log('Raw AI Response:', aiResponse);
      
      // Method 1: Try to find JSON block with code fence
      let jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          return this.formatParsedRecipe(parsed, originalDish);
        } catch (e) {
          console.log('Failed to parse JSON from code fence:', e.message);
        }
      }

      // Method 2: Try to find any JSON object in the response
      jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          // Clean up the JSON string before parsing - remove 'g' suffix from numbers
          let cleanedJson = jsonMatch[0].replace(/:\s*"?(\d+(?:\.\d+)?)\s*g"?/g, ': $1');
          const parsed = JSON.parse(cleanedJson);
          return this.formatParsedRecipe(parsed, originalDish);
        } catch (e) {
          console.log('Failed to parse JSON object:', e.message);
          // Try without cleaning
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            return this.formatParsedRecipe(parsed, originalDish);
          } catch (e2) {
            console.log('Failed to parse original JSON too:', e2.message);
          }
        }
      }

      // Method 3: Try multiple JSON objects and pick the best one
      const jsonMatches = aiResponse.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
      if (jsonMatches && jsonMatches.length > 0) {
        for (let i = jsonMatches.length - 1; i >= 0; i--) {
          try {
            const parsed = JSON.parse(jsonMatches[i]);
            if (parsed.name && parsed.ingredients && Array.isArray(parsed.ingredients)) {
              return this.formatParsedRecipe(parsed, originalDish);
            }
          } catch (e) {
            continue;
          }
        }
      }
      
      // Fallback: Parse manually if JSON parsing completely fails
      console.log('All JSON parsing methods failed, using fallback');
      return this.manualParseFallback(aiResponse, originalDish);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse vegan alternative response');
    }
  }

  /**
   * Format a successfully parsed recipe object
   */
  formatParsedRecipe(parsed, originalDish) {
    // Clean up nutritional info - remove 'g' suffix if present
    const nutritionalInfo = {};
    if (parsed.nutritionalInfo) {
      Object.keys(parsed.nutritionalInfo).forEach(key => {
        const value = parsed.nutritionalInfo[key];
        if (typeof value === 'string') {
          nutritionalInfo[key] = parseInt(value.replace(/[^\d]/g, '')) || 0;
        } else {
          nutritionalInfo[key] = value;
        }
      });
    }

    return {
      name: parsed.name || `Vegan ${originalDish.name}`,
      description: parsed.description || 'A delicious vegan alternative',
      ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
      instructions: Array.isArray(parsed.instructions) ? parsed.instructions : [],
      prepTime: parseInt(parsed.prepTime) || 30,
      cookTime: parseInt(parsed.cookTime) || 30,
      servings: parseInt(parsed.servings) || 4,
      difficulty: parsed.difficulty || 'medium',
      nutritionalInfo: nutritionalInfo,
      tags: parsed.tags || ['vegan', 'healthy'],
      isVegan: true,
      generatedByAI: true,
      source: 'ai-generated',
      cuisine: originalDish.cuisine || parsed.cuisine || 'International'
    };
  }

  /**
   * Manual parsing fallback when JSON parsing fails
   */
  manualParseFallback(aiResponse, originalDish) {
    return {
      name: `Vegan ${originalDish.name}`,
      description: 'A delicious vegan alternative. Please see instructions for full details.',
      ingredients: [],
      instructions: [aiResponse],
      prepTime: 30,
      cookTime: 30,
      servings: 4,
      difficulty: 'medium',
      nutritionalInfo: {},
      isVegan: true,
      generatedByAI: true,
      source: 'ai-generated',
      cuisine: originalDish.cuisine || 'International'
    };
  }

  /**
   * Get ingredient substitutions
   */
  async getIngredientSubstitution(ingredientName) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a vegan cooking expert. Provide vegan substitutions for non-vegan ingredients.'
            },
            {
              role: 'user',
              content: `What is the best vegan substitute for "${ingredientName}"? Provide a brief answer with the substitute name and how to use it.`
            }
          ],
          temperature: 0.7,
          max_tokens: 200,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Blackbox API Error:', error.response?.data || error.message);
      throw new Error('Failed to get ingredient substitution');
    }
  }

  /**
   * Analyze if a dish is vegan
   */
  async analyzeDishVeganStatus(dishData) {
    try {
      const ingredients = dishData.ingredients.map(ing => ing.name || ing).join(', ');
      
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a vegan diet expert. Analyze ingredients and determine if they are vegan.'
            },
            {
              role: 'user',
              content: `Analyze these ingredients and tell me if this dish is vegan: ${ingredients}. Respond with JSON: {"isVegan": true/false, "nonVeganIngredients": ["ingredient1", "ingredient2"], "explanation": "brief explanation"}`
            }
          ],
          temperature: 0.3,
          max_tokens: 300,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        isVegan: false,
        nonVeganIngredients: [],
        explanation: aiResponse
      };
    } catch (error) {
      console.error('Blackbox API Error:', error.response?.data || error.message);
      throw new Error('Failed to analyze dish vegan status');
    }
  }
}

module.exports = new BlackboxService();
