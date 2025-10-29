# 🤖 Blackbox AI Integration Guide

## Overview

This application uses the Blackbox AI API to generate vegan alternatives to non-vegan dishes. The integration is handled in `backend/src/services/blackboxService.js`.

## Getting Your API Key

1. Visit [Blackbox AI Dashboard](https://www.blackbox.ai/dashboard)
2. Sign up or log in
3. Navigate to API Keys section
4. Copy your API key
5. Add it to `backend/.env`:

```env
BLACKBOX_API_KEY=your_actual_api_key_here
```

## API Configuration

### Endpoint
```
POST https://api.blackbox.ai/chat/completions
```

### Model Used
```javascript
model: "blackboxai/openai/gpt-4"
```

### Headers
```javascript
{
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}
```

## How It Works in Our App

### 1. User Request Flow

```
User enters dish → Check database → No match? → Call Blackbox AI → Save result
                                  ↓
                              Match found → Return existing recipe
```

### 2. Prompt Engineering

Our service creates structured prompts for the AI:

```javascript
const prompt = `
I need a vegan alternative for: ${dishName}

Please provide:
1. Creative vegan dish name
2. Detailed description
3. Complete ingredients with quantities
4. Step-by-step instructions
5. Prep and cook times
6. Servings
7. Difficulty level
8. Nutritional information
9. Tips and variations

Format as JSON: {...}
`;
```

### 3. Request Parameters

```javascript
{
  model: "blackboxai/openai/gpt-4",
  messages: [
    {
      role: "system",
      content: "You are a professional vegan chef..."
    },
    {
      role: "user",
      content: prompt
    }
  ],
  temperature: 0.7,      // Creativity level
  max_tokens: 2000,      // Response length
  stream: false          // Get complete response
}
```

### 4. Response Parsing

The AI returns JSON which we parse into our Dish model:

```javascript
{
  name: "Vegan Chicken Parmesan",
  description: "Crispy breaded tofu...",
  ingredients: [
    { name: "Firm tofu", quantity: "400g" },
    { name: "Breadcrumbs", quantity: "1 cup" },
    ...
  ],
  instructions: [
    "Press tofu to remove moisture",
    "Bread the tofu slices",
    ...
  ],
  prepTime: 20,
  cookTime: 25,
  servings: 4,
  difficulty: "medium",
  nutritionalInfo: {
    calories: 350,
    protein: 18,
    carbs: 42,
    fat: 12
  }
}
```

## Code Implementation

### Main Service Method

```javascript
// backend/src/services/blackboxService.js

async generateVeganAlternative(dishData) {
  try {
    const prompt = this.createVeganAlternativePrompt(dishData);
    
    const response = await axios.post(
      this.apiUrl,
      {
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a vegan chef...' },
          { role: 'user', content: prompt }
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
    console.error('Blackbox API Error:', error);
    throw new Error('Failed to generate vegan alternative');
  }
}
```

### API Route

```javascript
// backend/src/routes/dishes.js

router.post('/generate-vegan-alternative', async (req, res) => {
  try {
    const { dishName, description, ingredients, cuisine } = req.body;

    // 1. Check database first
    const existingMatch = await matchingService.findBestMatch({
      name: dishName,
      description,
      ingredients,
      cuisine
    });

    if (existingMatch) {
      return res.json({
        source: 'database',
        dish: existingMatch,
        message: 'Found matching vegan dish in database'
      });
    }

    // 2. Generate with AI
    const veganAlternative = await blackboxService.generateVeganAlternative({
      name: dishName,
      description,
      ingredients,
      cuisine
    });

    // 3. Save to database
    const newDish = new Dish(veganAlternative);
    await newDish.save();

    res.json({
      source: 'ai-generated',
      dish: newDish,
      message: 'Generated new vegan alternative using AI'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Testing the Integration

### 1. Test with cURL

```bash
curl -X POST http://localhost:5000/api/dishes/generate-vegan-alternative \
  -H "Content-Type: application/json" \
  -d '{
    "dishName": "Chicken Tikka Masala",
    "description": "Creamy Indian curry",
    "ingredients": ["chicken", "cream", "tomatoes"],
    "cuisine": "Indian"
  }'
```

### 2. Test from Frontend

1. Go to http://localhost:3000/dish-input
2. Enter "Chicken Tikka Masala"
3. Click "Get Vegan Alternative"
4. Wait for AI response (5-10 seconds)
5. View the generated recipe

### 3. Expected Response

```json
{
  "source": "ai-generated",
  "dish": {
    "_id": "...",
    "name": "Vegan Tikka Masala",
    "description": "Creamy plant-based Indian curry...",
    "ingredients": [...],
    "instructions": [...],
    "isVegan": true,
    "generatedByAI": true
  },
  "message": "Generated new vegan alternative using AI"
}
```

## Error Handling

### Common Errors

1. **Invalid API Key**
```
Error: Failed to generate vegan alternative
Solution: Check BLACKBOX_API_KEY in .env
```

2. **Rate Limit Exceeded**
```
Error: 429 Too Many Requests
Solution: Wait or upgrade API plan
```

3. **Timeout**
```
Error: Request timeout
Solution: Increase axios timeout or retry
```

### Error Handling in Code

```javascript
try {
  const response = await blackboxService.generateVeganAlternative(data);
  // Success
} catch (error) {
  if (error.response?.status === 429) {
    // Rate limit
    toast.error('Too many requests. Please try again later.');
  } else if (error.response?.status === 401) {
    // Invalid API key
    toast.error('API authentication failed. Check your API key.');
  } else {
    // Generic error
    toast.error('Failed to generate recipe. Please try again.');
  }
}
```

## Cost Optimization

### Strategies Implemented

1. **Database First**: Always check existing recipes before calling AI
2. **Caching**: Save all AI-generated recipes for reuse
3. **Smart Matching**: Use similarity algorithm to find close matches
4. **Batch Processing**: Could generate multiple variations at once

### Monitoring Usage

Track API calls in your application:

```javascript
// Add to blackboxService.js
let apiCallCount = 0;

async generateVeganAlternative(dishData) {
  apiCallCount++;
  console.log(`Blackbox API Call #${apiCallCount}`);
  // ... rest of code
}
```

## Advanced Features

### 1. Ingredient Substitution

```javascript
async getIngredientSubstitution(ingredientName) {
  const response = await axios.post(this.apiUrl, {
    model: this.model,
    messages: [
      {
        role: "user",
        content: `What is the best vegan substitute for "${ingredientName}"?`
      }
    ],
    max_tokens: 200
  });
  return response.data.choices[0].message.content;
}
```

### 2. Vegan Analysis

```javascript
async analyzeDishVeganStatus(dishData) {
  const ingredients = dishData.ingredients.join(', ');
  const response = await axios.post(this.apiUrl, {
    model: this.model,
    messages: [
      {
        role: "user",
        content: `Are these ingredients vegan: ${ingredients}?`
      }
    ]
  });
  return response.data.choices[0].message.content;
}
```

## Best Practices

1. **Always validate input** before calling API
2. **Implement retry logic** for transient failures
3. **Cache responses** to reduce costs
4. **Monitor API usage** and set limits
5. **Handle errors gracefully** with user-friendly messages
6. **Use appropriate temperature** (0.7 for creative recipes)
7. **Set reasonable max_tokens** (2000 for full recipes)

## Troubleshooting

### API Key Issues
```bash
# Test your API key
curl -X POST https://api.blackbox.ai/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"blackboxai/openai/gpt-4","messages":[{"role":"user","content":"Hello"}]}'
```

### Check Logs
```bash
# Backend logs show API calls
cd backend
npm run dev
# Watch for "Blackbox API Error:" messages
```

### Verify Environment
```bash
# Check if API key is loaded
node -e "require('dotenv').config(); console.log(process.env.BLACKBOX_API_KEY)"
```

## Resources

- [Blackbox AI Dashboard](https://www.blackbox.ai/dashboard)
- [API Documentation](https://www.blackbox.ai/docs)
- Our implementation: `backend/src/services/blackboxService.js`

---

**Ready to generate amazing vegan recipes! 🌱**
