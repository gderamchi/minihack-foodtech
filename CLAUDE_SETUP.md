# Claude Sonnet 4.5 Menu Generation - COMPLETE ✅

## ✅ What Was Implemented

The menu generation now uses **Claude Sonnet 4.5** (via Blackbox AI API) to generate **21 unique, personalized vegan recipes** based on user's questionnaire data.

**IMPORTANT:** Uses your existing BLACKBOX_API_KEY - no new API key needed!

### Features:
- **Personalized recipes** based on user preferences from onboarding
- **21 unique meals** (7 days × 3 meals per day)
- Each meal generated individually with Claude AI
- Uses user's dietary restrictions, allergies, favorite cuisines, cooking skill, time available, health goals, and budget
- Complete nutritional information for each meal
- Detailed ingredients with quantities
- Step-by-step cooking instructions

---

## ✅ No Additional Setup Required!

**Good news:** This uses your existing `BLACKBOX_API_KEY` environment variable that's already configured in Vercel!

The Blackbox AI API provides access to Claude Sonnet 4.5 through the model: `blackboxai/anthropic/claude-sonnet-4.5`

**Already configured:**
- ✅ BLACKBOX_API_KEY (already in Vercel)
- ✅ BLACKBOX_API_URL (defaults to https://api.blackbox.ai/chat/completions)
- ✅ Model: blackboxai/anthropic/claude-sonnet-4.5

**Deployment:** Automatically deployed with commit 31c68cf

---

## 📋 How It Works

### User Flow:
1. User completes onboarding questionnaire
2. User clicks "Generate Weekly Menu"
3. Backend fetches user's preferences from MongoDB
4. For each of 21 meals (7 days × 3 meals):
   - Sends personalized prompt to Claude Sonnet 4.5
   - Includes user's dietary restrictions, allergies, cuisines, skill level, time, goals, budget
   - Claude generates unique vegan recipe with complete details
   - Recipe saved to MongoDB
5. All 21 meals displayed in weekly menu view
6. User can view shopping list with all ingredients

### Example Prompt Sent to Claude:
```
You are a professional vegan chef and nutritionist. Generate a delicious, healthy vegan breakfast recipe personalized for this user.

User Profile:
- Dietary preferences: Gluten-free
- Allergies: Nuts
- Favorite cuisines: Mediterranean, Asian
- Cooking skill: Intermediate
- Time available: 30-45 minutes
- Health goals: Weight loss, Muscle gain
- Budget: Moderate

Requirements:
- Must be 100% vegan (no animal products)
- Include complete nutritional information
- Provide detailed ingredients with quantities
- Include step-by-step cooking instructions
- Consider user's preferences and restrictions

Return ONLY a valid JSON object with recipe details...
```

### Claude Response:
Claude returns a complete recipe with:
- Name and description
- Prep and cook time
- Servings and difficulty
- Complete nutrition (calories, protein, carbs, fat, fiber)
- Detailed ingredients list with quantities and categories
- Step-by-step instructions
- Tags and cuisine type

---

## ⚡ Performance

- **Generation time:** ~60-90 seconds for all 21 meals
- **Cost:** ~$0.10-0.15 per menu generation (Claude Sonnet 4.5 pricing)
- **Quality:** Professional, personalized, nutritionally balanced recipes
- **Fallback:** If Claude fails, uses simple fallback recipes

---

## 🔧 Technical Details

### API Used:
- **Provider:** Blackbox AI
- **Model:** `blackboxai/anthropic/claude-sonnet-4.5` (Claude Sonnet 4.5)
- **Max tokens:** 2000 per recipe
- **Total API calls:** 21 per menu generation (sequential)
- **API Key:** Uses existing BLACKBOX_API_KEY

### Code Location:
- **File:** `api/weekly-menu.js`
- **Function:** `handleGenerate()`
- **Lines:** 105-280

### Dependencies:
- Uses existing `axios` (already installed)
- No new dependencies needed!

---

## 🐛 Troubleshooting

### Issue: "No meals generated" or empty menu

**Cause:** Missing or invalid BLACKBOX_API_KEY

**Solution:**
1. Check Vercel environment variables for BLACKBOX_API_KEY
2. Verify key is valid
3. Check Blackbox AI API status

### Issue: "Generation taking too long"

**Cause:** Generating 21 meals takes 60-90 seconds

**Solution:**
- This is normal - Claude generates each meal individually
- Frontend shows loading message
- User should wait for completion

### Issue: "Some meals are fallback recipes"

**Cause:** Blackbox API error for specific meals

**Solution:**
- Check Vercel logs for specific errors
- Verify BLACKBOX_API_KEY has sufficient credits
- Check Blackbox AI API status

---

## 💰 Cost Estimation

Based on Blackbox AI pricing for Claude Sonnet 4.5:
- **Input:** ~500 tokens per meal × 21 meals = 10,500 tokens
- **Output:** ~800 tokens per meal × 21 meals = 16,800 tokens
- **Total cost per menu:** ~$0.10-0.15 (varies by Blackbox pricing)
- **Monthly cost (100 users, 1 menu/week):** ~$10-15
- **Note:** Check your Blackbox AI plan for exact pricing

---

## ✅ Verification

To verify it's working:

1. **Check Vercel Logs:**
   ```
   vercel logs --follow
   ```
   Look for: "Generating meal for monday breakfast..."

2. **Test Menu Generation:**
   - Login to app
   - Click "Generate Weekly Menu"
   - Wait 60-90 seconds
   - Check if all 21 meals are populated
   - Verify meals are unique and personalized

3. **Check Response:**
   Each meal should have:
   - Unique name (not "Vegan Breakfast")
   - Complete ingredients list
   - Detailed instructions
   - Nutrition information

---

## 🎉 Success Indicators

✅ Menu generation completes in 60-90 seconds  
✅ All 21 meals are unique recipes  
✅ Meals match user's preferences  
✅ Complete ingredients and instructions  
✅ Shopping list extracts all ingredients  
✅ No "fallback" recipes (unless API error)  

---

## 📞 Support

If you encounter issues:
1. Check Vercel logs for errors
2. Verify BLACKBOX_API_KEY is set correctly in Vercel
3. Ensure API key has sufficient credits
4. Check Blackbox AI API status

---

**Status:** ✅ Implemented and deployed  
**Commits:** 
- e0cfcb4 - Initial Claude implementation
- 31c68cf - Fixed to use Blackbox API (current)

**Ready to use:** YES - Uses existing BLACKBOX_API_KEY!
