# 🎯 Personalized Meal Planning System - Complete Specification

## Overview
A comprehensive, AI-powered meal planning system with exhaustive user profiling for maximum personalization.

---

## 1. User Onboarding Flow

### Sign-up Process
1. User signs up (Google/Facebook/Email)
2. **Mandatory** multi-step questionnaire (cannot skip)
3. Explanatory message at start: "Help us personalize your vegan journey! This takes 3-5 minutes and ensures every recipe is perfect for you."
4. Progress bar showing completion (e.g., "Step 3 of 8")
5. Smooth animations between steps
6. Option to save and continue later (data persists)

---

## 2. Questionnaire Structure (8 Steps)

### Step 1: Personal Information
- **Name** (text input)
- **Age** (number input)
- **Location** (autocomplete with geolocation)
- **Number of people cooking for** (1, 2, 3, 4, 5+)
- **Household type** (single, couple, family with kids, roommates)

### Step 2: Physical Profile (For Each Person)
*If cooking for multiple people, repeat for each person*

**Person 1 (You):**
- Height (cm/ft)
- Weight (kg/lbs)
- Gender (male, female, other, prefer not to say)
- Activity level (sedentary, light, moderate, very active, athlete)
- Appetite size (small, medium, large, very large)
- Eating habits (grazer, 3 meals, intermittent fasting)

**Person 2, 3, etc.** (if applicable):
- Same questions as above
- Relationship (partner, child, roommate, etc.)
- Age group (child, teen, adult, senior)

### Step 3: Dietary Restrictions & Allergies
- **Dietary restrictions** (multi-select):
  - Gluten-free
  - Nut-free
  - Soy-free
  - Oil-free
  - Sugar-free
  - Raw vegan
  - Whole food plant-based
  - Other (text input)

- **Allergies** (multi-select + text input):
  - Tree nuts
  - Peanuts
  - Soy
  - Wheat/Gluten
  - Sesame
  - Other (specify)

- **Intolerances**:
  - Lactose (for vegan alternatives)
  - Fructose
  - Other

### Step 4: Food Preferences
- **Favorite cuisines** (multi-select, min 3):
  - Italian, French, Mexican, Indian, Thai, Chinese, Japanese, Korean, Mediterranean, Middle Eastern, African, American, Fusion, Other

- **Disliked ingredients** (multi-select + text):
  - Mushrooms, Tofu, Tempeh, Seitan, Eggplant, Olives, Cilantro, Avocado, Coconut, Other

- **Preferred ingredients** (multi-select + text):
  - Specific vegetables, grains, legumes, etc.

- **Spice tolerance**:
  - Mild (no spice)
  - Medium (some spice)
  - Spicy (love heat)
  - Very spicy (bring the fire!)

- **Texture preferences** (multi-select):
  - Crunchy, Creamy, Chewy, Crispy, Soft, Smooth, Chunky

- **Flavor profiles** (multi-select):
  - Sweet, Savory, Umami, Tangy, Bitter, Sour, Rich, Light

### Step 5: Cooking Habits
- **Cooking skill level**:
  - Beginner (simple recipes)
  - Intermediate (moderate complexity)
  - Advanced (complex techniques)
  - Expert (chef-level)

- **Time available for cooking**:
  - 15 minutes or less
  - 30 minutes
  - 1 hour
  - 2+ hours
  - Varies by day

- **Cooking frequency**:
  - Daily
  - Few times per week
  - Weekends only
  - Rarely (meal prep)

- **Kitchen equipment** (multi-select):
  - Oven, Stovetop, Microwave, Air fryer, Instant Pot, Slow cooker, Blender, Food processor, Rice cooker, Other

- **Meal prep preference**:
  - Cook fresh daily
  - Batch cook (2-3 days)
  - Weekly meal prep (Sunday)
  - Mix of both

### Step 6: Meal Planning Preferences
- **Meals per day**: 1, 2, or 3
- **Which meals** (multi-select):
  - Breakfast
  - Lunch
  - Dinner
  - Snacks

- **Budget per week**:
  - Low ($30-50)
  - Medium ($50-100)
  - High ($100-150)
  - Premium ($150+)

- **Shopping preference**:
  - One big shop per week
  - Multiple small shops
  - Online delivery
  - Mix of both

- **Leftover preference**:
  - Love leftovers
  - Okay with leftovers
  - Prefer fresh meals
  - No leftovers

### Step 7: Health & Nutrition Goals
- **Primary health goal**:
  - Weight loss
  - Muscle gain
  - Maintain weight
  - General health
  - Athletic performance
  - Disease management

- **Calorie target** (optional):
  - Auto-calculate based on profile
  - Custom input (number)
  - No tracking

- **Macro preferences**:
  - High protein
  - Low carb
  - High carb
  - Balanced
  - No preference

- **Nutritional focus** (multi-select):
  - High fiber
  - High iron
  - High calcium
  - High B12
  - Omega-3
  - No specific focus

### Step 8: Automation & Preferences
- **Menu generation preference**:
  - ✅ Automated weekly menu (recommended)
  - Manual generation (I'll create my own)
  - Hybrid (suggest + I customize)

- **If automated selected**:
  - Start day: Sunday, Monday, etc.
  - Generate how many days in advance: 1, 2, 3 days
  - Notification preference: Yes/No
  - Notification time: Morning, Afternoon, Evening

- **Recurring preferences** (optional):
  - "Always pasta on Fridays"
  - "No cooking on Mondays"
  - "Light dinners on weekdays"
  - Custom rules (text input)

- **Variety preference**:
  - High variety (different every day)
  - Medium variety (some repeats okay)
  - Low variety (repeat favorites)

---

## 3. Weekly Menu Generation System

### Generation Logic
```javascript
generateWeeklyMenu(userProfile) {
  // 1. Calculate nutritional needs per person
  const nutritionNeeds = calculateNutrition(userProfile.people);
  
  // 2. Get nearby stores and available ingredients
  const nearbyStores = await getNearbyStores(userProfile.location);
  const availableIngredients = getStoreIngredients(nearbyStores);
  
  // 3. Filter recipes based on preferences
  const eligibleRecipes = filterRecipes({
    cuisines: userProfile.favoriteCuisines,
    restrictions: userProfile.dietaryRestrictions,
    allergies: userProfile.allergies,
    dislikedIngredients: userProfile.dislikedIngredients,
    skillLevel: userProfile.cookingSkill,
    maxTime: userProfile.timeAvailable,
    availableIngredients: availableIngredients,
    budget: userProfile.budget
  });
  
  // 4. Generate menu using AI
  const weeklyMenu = await blackboxAI.generateMenu({
    recipes: eligibleRecipes,
    days: 7,
    mealsPerDay: userProfile.mealsPerDay,
    mealTypes: userProfile.mealTypes,
    nutritionTargets: nutritionNeeds,
    variety: userProfile.varietyPreference,
    recurringPreferences: userProfile.recurringPreferences
  });
  
  // 5. Adjust portions for household size
  const adjustedMenu = adjustPortions(weeklyMenu, userProfile.people);
  
  // 6. Generate shopping list
  const shoppingList = generateShoppingList(adjustedMenu, nearbyStores);
  
  return { menu: adjustedMenu, shoppingList };
}
```

### Portion Calculation
```javascript
calculatePortions(recipe, people) {
  const totalCalorieNeeds = people.reduce((sum, person) => {
    const bmr = calculateBMR(person.height, person.weight, person.age, person.gender);
    const tdee = bmr * getActivityMultiplier(person.activityLevel);
    const adjusted = adjustForAppetite(tdee, person.appetiteSize);
    return sum + adjusted;
  }, 0);
  
  const portionMultiplier = totalCalorieNeeds / recipe.baseCalories;
  
  return {
    servings: Math.ceil(portionMultiplier),
    ingredients: recipe.ingredients.map(ing => ({
      ...ing,
      quantity: multiplyQuantity(ing.quantity, portionMultiplier)
    }))
  };
}
```

---

## 4. Menu Management Features

### View Weekly Menu
- Calendar view (7 days)
- Each day shows: Breakfast, Lunch, Dinner, Snacks
- Recipe cards with:
  - Photo
  - Name
  - Prep + cook time
  - Calories per serving
  - Quick actions: View, Swap, Regenerate

### Swap Individual Meal
```
User clicks "Swap" on Monday's dinner
→ Modal opens: "Why don't you like this meal?"
  - Too spicy
  - Don't like ingredient (specify)
  - Too complex
  - Not enough time
  - Other (text input)
→ AI generates alternative based on feedback
→ User can accept or try another
```

### Regenerate Entire Menu
- Button: "Generate New Menu"
- Options:
  - Keep some meals (select which ones)
  - Change preferences temporarily
  - Use different template

### Edit Menu Manually
- Drag & drop meals between days
- Add custom recipes
- Remove meals
- Duplicate meals
- Adjust servings per meal

### Templates
- **Quick & Easy Week**: All meals under 30 min
- **Gourmet Week**: Complex, restaurant-quality
- **Budget-Friendly Week**: Under $50 total
- **High Protein Week**: 25g+ protein per meal
- **Meal Prep Week**: Batch-cookable recipes
- **Family-Friendly Week**: Kid-approved meals
- **Athletic Performance Week**: Optimized for training

### Save Favorite Menus
- Button: "Save This Menu"
- Name the menu
- Add notes
- Reuse anytime
- Share with community (optional)

---

## 5. Shopping List System

### Generation
```javascript
generateShoppingList(weeklyMenu, nearbyStores) {
  // 1. Aggregate all ingredients
  const allIngredients = aggregateIngredients(weeklyMenu);
  
  // 2. Group by category
  const grouped = groupByCategory(allIngredients);
  // Categories: Produce, Grains, Proteins, Dairy Alternatives, 
  //             Spices, Condiments, Frozen, Canned, Other
  
  // 3. Find best stores for each item
  const withStores = allIngredients.map(ing => ({
    ...ing,
    availableAt: findStoresWithItem(ing, nearbyStores),
    bestPrice: findBestPrice(ing, nearbyStores)
  }));
  
  // 4. Optimize shopping route
  const optimized = optimizeShoppingRoute(withStores, nearbyStores);
  
  return {
    byCategory: grouped,
    byStore: optimized,
    totalCost: calculateTotal(withStores),
    missingItems: withStores.filter(i => i.availableAt.length === 0)
  };
}
```

### Shopping List Features
- **View modes**:
  - By category (Produce, Grains, etc.)
  - By store (Shop A: items, Shop B: items)
  - By day (Monday's ingredients, Tuesday's, etc.)

- **Interactive checklist**:
  - Check off items as you shop
  - Mark as "couldn't find"
  - Add custom items
  - Notes per item

- **Store integration**:
  - Show which stores have each item
  - Price comparison
  - Directions to stores
  - Store hours

- **Smart features**:
  - Pantry staples (check what you already have)
  - Bulk buying suggestions
  - Seasonal alternatives
  - Budget tracking

- **Export options**:
  - Print PDF
  - Email to yourself
  - Share with household
  - Send to phone

---

## 6. Automated Menu Generation

### Weekly Automation
```javascript
// Runs every Sunday at user's preferred time
async function autoGenerateWeeklyMenu(userId) {
  const user = await User.findById(userId);
  
  if (!user.preferences.automatedMenu) return;
  
  // Generate menu for next week
  const menu = await generateWeeklyMenu(user.profile);
  
  // Save to database
  await WeeklyMenu.create({
    user: userId,
    weekStart: getNextWeekStart(user.preferences.startDay),
    menu: menu.menu,
    shoppingList: menu.shoppingList,
    generatedAt: new Date()
  });
  
  // Send notification if enabled
  if (user.preferences.notifications) {
    await sendNotification(userId, {
      title: "Your Weekly Menu is Ready! 🌱",
      body: "Check out your personalized vegan menu for next week",
      link: "/weekly-menu"
    });
  }
}
```

### Notification System
- **Push notifications** (if user enabled)
- **Email notifications** (optional)
- **In-app notifications**
- **Notification content**:
  - "Your menu for [Week of Date] is ready!"
  - Preview of 3 featured meals
  - Shopping list summary
  - CTA: "View Full Menu"

---

## 7. Profile Management

### Update Profile Anytime
- Settings page with all questionnaire fields
- Edit any section independently
- Changes trigger menu regeneration prompt:
  "Your preferences changed. Regenerate this week's menu?"

### Dynamic Data Storage
```javascript
// Only store what's provided
const userSchema = new mongoose.Schema({
  // Required fields
  email: { type: String, required: true },
  name: { type: String, required: true },
  
  // Optional fields (only stored if provided)
  age: Number,
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: [Number],
    address: String
  },
  
  // Nested optional fields
  people: [{
    name: String,
    relationship: String,
    height: Number,
    weight: Number,
    // ... only stored if provided
  }],
  
  // Preferences (all optional)
  preferences: {
    cuisines: [String],
    restrictions: [String],
    // ... only stored if provided
  }
}, {
  // Automatically remove undefined fields
  minimize: true,
  // Add timestamps
  timestamps: true
});

// Middleware to clean up deleted data
userSchema.pre('save', function(next) {
  // Remove empty arrays
  Object.keys(this.toObject()).forEach(key => {
    if (Array.isArray(this[key]) && this[key].length === 0) {
      this[key] = undefined;
    }
  });
  next();
});
```

---

## 8. Database Schema Updates

### User Model Enhancement
```javascript
{
  // ... existing fields
  
  profile: {
    personal: {
      age: Number,
      location: { type: Point, coordinates: [Number] },
      householdSize: Number,
      householdType: String
    },
    
    people: [{
      name: String,
      relationship: String,
      ageGroup: String,
      height: Number,
      weight: Number,
      gender: String,
      activityLevel: String,
      appetiteSize: String,
      eatingHabits: String
    }],
    
    dietary: {
      restrictions: [String],
      allergies: [String],
      intolerances: [String]
    },
    
    foodPreferences: {
      favoriteCuisines: [String],
      dislikedIngredients: [String],
      preferredIngredients: [String],
      spiceTolerance: String,
      texturePreferences: [String],
      flavorProfiles: [String]
    },
    
    cooking: {
      skillLevel: String,
      timeAvailable: Number,
      frequency: String,
      equipment: [String],
      mealPrepPreference: String
    },
    
    mealPlanning: {
      mealsPerDay: Number,
      mealTypes: [String],
      budget: String,
      shoppingPreference: String,
      leftoverPreference: String
    },
    
    health: {
      primaryGoal: String,
      calorieTarget: Number,
      macroPreferences: String,
      nutritionalFocus: [String]
    },
    
    automation: {
      enabled: Boolean,
      startDay: String,
      daysInAdvance: Number,
      notifications: Boolean,
      notificationTime: String,
      recurringPreferences: [String],
      varietyPreference: String
    }
  },
  
  onboardingCompleted: { type: Boolean, default: false },
  onboardingStep: { type: Number, default: 0 }
}
```

### WeeklyMenu Model
```javascript
{
  user: { type: ObjectId, ref: 'User' },
  weekStart: Date,
  weekEnd: Date,
  
  menu: {
    monday: { breakfast: Dish, lunch: Dish, dinner: Dish, snacks: [Dish] },
    tuesday: { ... },
    // ... all days
  },
  
  shoppingList: {
    byCategory: [{
      category: String,
      items: [{
        ingredient: ObjectId,
        name: String,
        quantity: String,
        checked: Boolean,
        notes: String
      }]
    }],
    
    byStore: [{
      store: ObjectId,
      items: [{ ingredient, quantity, price }]
    }],
    
    totalCost: Number,
    missingItems: [String]
  },
  
  template: String,
  isFavorite: Boolean,
  customizations: [{
    day: String,
    meal: String,
    originalDish: ObjectId,
    reason: String,
    timestamp: Date
  }],
  
  generatedAt: Date,
  lastModified: Date
}
```

---

## 9. UI/UX Design Principles

### Questionnaire UX
- **Progress indicator**: "Step 3 of 8 - Food Preferences"
- **Smooth transitions**: Slide animations between steps
- **Visual feedback**: Checkmarks for completed steps
- **Save progress**: Auto-save every step
- **Back button**: Can go back to edit previous steps
- **Skip individual questions**: Some optional fields can be skipped
- **Helpful tooltips**: Explain why we ask each question
- **Estimated time**: "3-5 minutes remaining"

### Menu View UX
- **Calendar layout**: Week at a glance
- **Hover previews**: Quick recipe preview on hover
- **Drag & drop**: Rearrange meals easily
- **Quick actions**: Swap, Regenerate, View, Edit
- **Visual indicators**: Icons for dietary info, time, difficulty
- **Mobile-optimized**: Swipe between days

### Shopping List UX
- **Checkbox interactions**: Satisfying check animation
- **Category collapse**: Expand/collapse categories
- **Store tabs**: Switch between stores
- **Search**: Find items quickly
- **Filters**: Show only unchecked, by store, etc.
- **Share button**: Send to family members

---

## 10. Implementation Priority

### Phase 1: Foundation (Week 1)
1. ✅ Firebase authentication setup
2. ✅ Enhanced User model with profile fields
3. ✅ Multi-step questionnaire component
4. ✅ Profile storage API endpoints

### Phase 2: Menu Generation (Week 2)
5. ✅ Weekly menu generation logic
6. ✅ Portion calculation system
7. ✅ AI integration for personalized menus
8. ✅ Menu display UI

### Phase 3: Customization (Week 3)
9. ✅ Swap meal functionality
10. ✅ Regenerate menu
11. ✅ Manual editing
12. ✅ Templates

### Phase 4: Shopping & Automation (Week 4)
13. ✅ Shopping list generation
14. ✅ Store integration
15. ✅ Automated weekly generation
16. ✅ Notification system

### Phase 5: Polish (Week 5)
17. ✅ Profile editing
18. ✅ Favorite menus
19. ✅ Performance optimization
20. ✅ Testing & bug fixes

---

## Success Metrics

### User Engagement
- Questionnaire completion rate: >90%
- Weekly menu generation: >80% of users
- Menu customization: >60% make edits
- Shopping list usage: >70% use it

### Personalization Quality
- Meal satisfaction rating: >4.5/5
- Swap rate: <20% (means good initial suggestions)
- Menu regeneration: <30% (means good first attempt)
- Recurring users: >70% return weekly

### Technical Performance
- Questionnaire load time: <2s
- Menu generation time: <10s
- Profile update: <1s
- Database queries: <100ms

---

This specification provides a complete blueprint for building the personalized meal planning system. Ready to start implementation!
