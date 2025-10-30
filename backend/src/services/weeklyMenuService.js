const blackboxService = require('./blackboxService');
const User = require('../models/User');
const Menu = require('../models/Menu');
const Dish = require('../models/Dish');
const WeeklyMenu = require('../models/WeeklyMenu');

class WeeklyMenuService {
  /**
   * Generate a personalized weekly menu for a user
   */
  async generateWeeklyMenu(userId) {
    try {
      // Get user profile with preferences
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const prefs = user.onboardingData || {};
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const mealTypes = prefs.mealPlanning?.mealTypes || ['breakfast', 'lunch', 'dinner'];
      
      const weeklyPlan = {
        userId: user._id,
        startDate: this.getStartOfWeek(),
        endDate: this.getEndOfWeek(),
        days: []
      };

      // Generate meals for each day
      for (const day of days) {
        const dayPlan = {
          day,
          date: this.getDateForDay(day),
          meals: []
        };

        // Generate meals for each meal type
        for (const mealType of mealTypes) {
          try {
            const meal = await this.generateMeal(user, mealType, day);
            dayPlan.meals.push(meal);
          } catch (error) {
            console.error(`Error generating ${mealType} for ${day}:`, error.message);
            // Add a fallback meal
            dayPlan.meals.push(this.getFallbackMeal(mealType));
          }
        }

        weeklyPlan.days.push(dayPlan);
      }

      // Calculate nutrition summary
      weeklyPlan.nutritionSummary = this.calculateWeeklyNutrition(weeklyPlan.days);

      // Save to database
      const savedMenu = await WeeklyMenu.create(weeklyPlan);
      
      return savedMenu;
    } catch (error) {
      console.error('Error generating weekly menu:', error);
      throw error;
    }
  }

  /**
   * Generate a single meal based on user preferences
   */
  async generateMeal(user, mealType, day) {
    const prefs = user.onboardingData || {};
    
    // Build meal requirements based on preferences
    const requirements = this.buildMealRequirements(user, mealType, day);
    
    // Try to find existing dish from database first
    const existingDish = await this.findMatchingDish(requirements);
    if (existingDish) {
      return {
        mealType,
        dish: existingDish._id,
        dishDetails: existingDish,
        source: 'database',
        servings: prefs.personal?.householdSize || 4
      };
    }

    // Generate new dish using AI
    const aiDish = await this.generateAIMeal(requirements);
    
    // Save AI-generated dish to database
    const savedDish = await Dish.create(aiDish);
    
    return {
      mealType,
      dish: savedDish._id,
      dishDetails: savedDish,
      source: 'ai-generated',
      servings: prefs.personal?.householdSize || 4
    };
  }

  /**
   * Build meal requirements from user preferences
   */
  buildMealRequirements(user, mealType, day) {
    const prefs = user.onboardingData || {};
    
    const requirements = {
      mealType,
      day,
      isVegan: true,
      
      // Dietary restrictions (CRITICAL)
      restrictions: prefs.dietary?.restrictions || [],
      allergies: prefs.dietary?.allergies || [],
      intolerances: prefs.dietary?.intolerances || [],
      
      // Preferences
      cuisines: prefs.foodPreferences?.favoriteCuisines || [],
      dislikedIngredients: prefs.foodPreferences?.dislikedIngredients || [],
      preferredIngredients: prefs.foodPreferences?.preferredIngredients || [],
      spiceTolerance: prefs.foodPreferences?.spiceTolerance || 'medium',
      texturePreferences: prefs.foodPreferences?.texturePreferences || [],
      flavorProfiles: prefs.foodPreferences?.flavorProfiles || [],
      
      // Cooking constraints
      skillLevel: prefs.cooking?.skillLevel || 'intermediate',
      maxTime: prefs.cooking?.timeAvailable || 45,
      equipment: prefs.cooking?.equipment || [],
      
      // Nutrition goals
      calorieTarget: this.getMealCalorieTarget(prefs, mealType),
      macroPreferences: prefs.health?.macroPreferences || 'balanced',
      healthGoal: prefs.health?.primaryGoal || 'general',
      
      // Household
      servings: prefs.personal?.householdSize || 4,
      
      // Additional
      notes: prefs.additionalNotes || ''
    };

    // Adjust requirements based on meal type
    if (mealType === 'breakfast') {
      requirements.maxTime = Math.min(requirements.maxTime, 30);
      requirements.preferredCharacteristics = ['quick', 'energizing', 'light'];
    } else if (mealType === 'lunch') {
      requirements.preferredCharacteristics = ['balanced', 'satisfying', 'portable'];
    } else if (mealType === 'dinner') {
      requirements.preferredCharacteristics = ['hearty', 'comforting', 'family-friendly'];
    } else if (mealType === 'snacks') {
      requirements.maxTime = 15;
      requirements.preferredCharacteristics = ['quick', 'portable', 'healthy'];
    }

    return requirements;
  }

  /**
   * Find matching dish from database
   */
  async findMatchingDish(requirements) {
    const query = {
      isVegan: true,
      difficulty: requirements.skillLevel
    };

    // Filter by cuisine if specified
    if (requirements.cuisines.length > 0) {
      query.cuisine = { $in: requirements.cuisines };
    }

    // Exclude allergens
    if (requirements.allergies.length > 0) {
      query['ingredients.name'] = { 
        $nin: requirements.allergies.map(a => new RegExp(a, 'i'))
      };
    }

    // Find dishes
    const dishes = await Dish.find(query).limit(10);
    
    if (dishes.length === 0) {
      return null;
    }

    // Return random dish from matches
    return dishes[Math.floor(Math.random() * dishes.length)];
  }

  /**
   * Generate meal using AI
   */
  async generateAIMeal(requirements) {
    // Build detailed prompt
    let prompt = `Generate a vegan ${requirements.mealType} recipe with the following requirements:\n\n`;
    
    prompt += `=== CRITICAL REQUIREMENTS ===\n`;
    if (requirements.allergies.length > 0) {
      prompt += `ALLERGIES (ABSOLUTELY MUST AVOID): ${requirements.allergies.join(', ')}\n`;
    }
    if (requirements.restrictions.length > 0) {
      prompt += `DIETARY RESTRICTIONS: ${requirements.restrictions.join(', ')}\n`;
    }
    if (requirements.intolerances.length > 0) {
      prompt += `INTOLERANCES: ${requirements.intolerances.join(', ')}\n`;
    }
    
    prompt += `\n=== PREFERENCES ===\n`;
    if (requirements.cuisines.length > 0) {
      prompt += `PREFERRED CUISINES: ${requirements.cuisines.join(', ')}\n`;
    }
    if (requirements.dislikedIngredients.length > 0) {
      prompt += `AVOID INGREDIENTS: ${requirements.dislikedIngredients.join(', ')}\n`;
    }
    if (requirements.preferredIngredients.length > 0) {
      prompt += `PREFERRED INGREDIENTS: ${requirements.preferredIngredients.join(', ')}\n`;
    }
    prompt += `SPICE LEVEL: ${requirements.spiceTolerance}\n`;
    if (requirements.texturePreferences.length > 0) {
      prompt += `TEXTURES: ${requirements.texturePreferences.join(', ')}\n`;
    }
    if (requirements.flavorProfiles.length > 0) {
      prompt += `FLAVORS: ${requirements.flavorProfiles.join(', ')}\n`;
    }
    
    prompt += `\n=== CONSTRAINTS ===\n`;
    prompt += `SKILL LEVEL: ${requirements.skillLevel}\n`;
    prompt += `MAX COOKING TIME: ${requirements.maxTime} minutes\n`;
    prompt += `SERVINGS: ${requirements.servings}\n`;
    prompt += `CALORIE TARGET: ~${requirements.calorieTarget} per serving\n`;
    if (requirements.equipment.length > 0) {
      prompt += `AVAILABLE EQUIPMENT: ${requirements.equipment.join(', ')}\n`;
    }
    
    if (requirements.notes) {
      prompt += `\nADDITIONAL NOTES: ${requirements.notes}\n`;
    }
    
    prompt += `\nGenerate a complete recipe in JSON format with: name, description, ingredients (with quantities), instructions, prepTime, cookTime, servings, difficulty, nutritionalInfo (calories, protein, carbs, fat, fiber), tags, and tips.`;

    // Call Blackbox AI
    const aiResponse = await blackboxService.generateVeganAlternative({
      name: `${requirements.mealType} recipe`,
      description: prompt,
      ingredients: [],
      cuisine: requirements.cuisines[0] || 'International'
    });

    return {
      ...aiResponse,
      mealType: requirements.mealType,
      isVegan: true,
      generatedByAI: true,
      source: 'ai-generated'
    };
  }

  /**
   * Get calorie target for specific meal
   */
  getMealCalorieTarget(prefs, mealType) {
    const dailyTarget = prefs.health?.calorieTarget || 2000;
    
    // Distribute calories across meals
    const distribution = {
      breakfast: 0.25,  // 25%
      lunch: 0.35,      // 35%
      dinner: 0.35,     // 35%
      snacks: 0.05      // 5%
    };

    return Math.round(dailyTarget * (distribution[mealType] || 0.33));
  }

  /**
   * Get fallback meal when generation fails
   */
  getFallbackMeal(mealType) {
    const fallbacks = {
      breakfast: {
        name: 'Overnight Oats',
        description: 'Simple and nutritious overnight oats',
        ingredients: [
          { name: 'Rolled oats', quantity: '1 cup' },
          { name: 'Plant milk', quantity: '1 cup' },
          { name: 'Chia seeds', quantity: '1 tbsp' },
          { name: 'Maple syrup', quantity: '1 tbsp' },
          { name: 'Fresh berries', quantity: '1/2 cup' }
        ],
        instructions: [
          'Mix oats, plant milk, and chia seeds in a jar',
          'Add maple syrup and stir well',
          'Refrigerate overnight',
          'Top with fresh berries before serving'
        ],
        prepTime: 5,
        cookTime: 0,
        servings: 2,
        difficulty: 'easy',
        nutritionalInfo: { calories: 300, protein: 8, carbs: 52, fat: 7, fiber: 8 }
      },
      lunch: {
        name: 'Buddha Bowl',
        description: 'Colorful and nutritious Buddha bowl',
        ingredients: [
          { name: 'Quinoa', quantity: '1 cup' },
          { name: 'Chickpeas', quantity: '1 can' },
          { name: 'Mixed greens', quantity: '2 cups' },
          { name: 'Cherry tomatoes', quantity: '1 cup' },
          { name: 'Avocado', quantity: '1' },
          { name: 'Tahini dressing', quantity: '3 tbsp' }
        ],
        instructions: [
          'Cook quinoa according to package',
          'Roast chickpeas with spices',
          'Arrange greens in bowl',
          'Top with quinoa, chickpeas, tomatoes, and avocado',
          'Drizzle with tahini dressing'
        ],
        prepTime: 10,
        cookTime: 20,
        servings: 2,
        difficulty: 'easy',
        nutritionalInfo: { calories: 450, protein: 15, carbs: 55, fat: 20, fiber: 12 }
      },
      dinner: {
        name: 'Pasta Primavera',
        description: 'Classic pasta with seasonal vegetables',
        ingredients: [
          { name: 'Pasta', quantity: '12 oz' },
          { name: 'Mixed vegetables', quantity: '3 cups' },
          { name: 'Garlic', quantity: '3 cloves' },
          { name: 'Olive oil', quantity: '3 tbsp' },
          { name: 'Nutritional yeast', quantity: '1/4 cup' },
          { name: 'Fresh basil', quantity: '1/4 cup' }
        ],
        instructions: [
          'Cook pasta according to package',
          'Sauté garlic in olive oil',
          'Add vegetables and cook until tender',
          'Toss with pasta',
          'Add nutritional yeast and basil',
          'Season to taste'
        ],
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        difficulty: 'easy',
        nutritionalInfo: { calories: 400, protein: 12, carbs: 65, fat: 10, fiber: 6 }
      }
    };

    return {
      mealType,
      dishDetails: fallbacks[mealType] || fallbacks.lunch,
      source: 'fallback',
      servings: 4
    };
  }

  /**
   * Calculate weekly nutrition summary
   */
  calculateWeeklyNutrition(days) {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let mealCount = 0;

    days.forEach(day => {
      day.meals.forEach(meal => {
        if (meal.dishDetails && meal.dishDetails.nutritionalInfo) {
          const nutrition = meal.dishDetails.nutritionalInfo;
          totalCalories += nutrition.calories || 0;
          totalProtein += nutrition.protein || 0;
          totalCarbs += nutrition.carbs || 0;
          totalFat += nutrition.fat || 0;
          totalFiber += nutrition.fiber || 0;
          mealCount++;
        }
      });
    });

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      averageCaloriesPerMeal: mealCount > 0 ? Math.round(totalCalories / mealCount) : 0,
      averageCaloriesPerDay: Math.round(totalCalories / 7)
    };
  }

  /**
   * Get start of current week (Monday)
   */
  getStartOfWeek() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(now.setDate(diff));
  }

  /**
   * Get end of current week (Sunday)
   */
  getEndOfWeek() {
    const start = this.getStartOfWeek();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  }

  /**
   * Get date for specific day of week
   */
  getDateForDay(dayName) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayIndex = days.indexOf(dayName);
    const start = this.getStartOfWeek();
    const date = new Date(start);
    date.setDate(start.getDate() + dayIndex);
    return date;
  }

  /**
   * Swap a meal in the weekly menu
   */
  async swapMeal(menuId, dayIndex, mealIndex, userId) {
    const menu = await WeeklyMenu.findById(menuId);
    if (!menu) {
      throw new Error('Menu not found');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const day = menu.days[dayIndex];
    const currentMeal = day.meals[mealIndex];
    
    // Generate new meal
    const newMeal = await this.generateMeal(user, currentMeal.mealType, day.day);
    
    // Replace meal
    menu.days[dayIndex].meals[mealIndex] = newMeal;
    
    // Recalculate nutrition
    menu.nutritionSummary = this.calculateWeeklyNutrition(menu.days);
    
    await menu.save();
    return menu;
  }

  /**
   * Get current week's menu for user
   */
  async getCurrentMenu(userId) {
    const startOfWeek = this.getStartOfWeek();
    const endOfWeek = this.getEndOfWeek();

    const menu = await WeeklyMenu.findOne({
      userId,
      startDate: { $gte: startOfWeek },
      endDate: { $lte: endOfWeek }
    }).populate('days.meals.dish');

    return menu;
  }
}

module.exports = new WeeklyMenuService();
