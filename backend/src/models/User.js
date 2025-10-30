const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const personSchema = new mongoose.Schema({
  name: String,
  relationship: String,
  ageGroup: String,
  height: Number,
  weight: Number,
  gender: String,
  activityLevel: String,
  appetiteSize: String,
  eatingHabits: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  // Authentication
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6
  },
  
  // Auto-set to 'vegan' (hidden from UI but kept for system logic)
  currentDiet: {
    type: String,
    default: 'vegan'
  },
  
  // Onboarding status
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  onboardingStep: {
    type: Number,
    default: 0
  },
  
  // Profile completion tracking
  profileCompletion: {
    percentage: {
      type: Number,
      default: 0
    },
    skippedSections: [String],
    lastUpdated: Date
  },
  
  // Gamification
  achievements: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    unlockedAt: Date
  }],
  streakDays: {
    type: Number,
    default: 0
  },
  lastActiveDate: Date,
  totalRecipesSaved: {
    type: Number,
    default: 0
  },
  totalMealPlansCreated: {
    type: Number,
    default: 0
  },
  
  // Enhanced Profile data
  profile: {
    // Step 1: Personal Information (EXPANDED)
    personal: {
      age: Number,
      gender: String,
      height: Number, // in cm
      weight: Number, // in kg
      location: {
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: [Number],
        address: String
      },
      householdSize: Number,
      householdType: String,
      language: String
    },
    
    // Step 2: Physical Profile (for each person)
    people: [personSchema],
    
    // Step 3: Vegan Journey (NEW)
    veganJourney: {
      duration: String, // 'just-starting', '<6months', '6-12months', '1-2years', '2+years'
      motivations: [String], // 'health', 'environment', 'animal-welfare', 'religious', 'cost', 'other'
      transitionChallenges: [String],
      supportLevel: String // 'family-support', 'friends-support', 'solo', 'online-community'
    },
    
    // Step 4: Dietary Goals (EXPANDED)
    dietaryGoals: [String], // 'health', 'weight-management', 'energy', 'environment', 'animal-welfare', 'athletic-performance', 'disease-prevention', 'longevity'
    
    // Step 5: Health Conditions (NEW)
    healthConditions: {
      conditions: [String], // 'diabetes', 'high-bp', 'high-cholesterol', 'heart-disease', 'digestive-issues', 'thyroid', 'pcos', 'none'
      isPregnant: Boolean,
      isBreastfeeding: Boolean,
      supplements: [String],
      medications: [String]
    },
    
    // Step 6: Dietary Restrictions & Allergies (EXPANDED)
    dietary: {
      restrictions: [String], // 'gluten-free', 'soy-free', 'oil-free', 'low-sodium', 'low-sugar', 'raw-food'
      allergies: [String], // 'peanuts', 'tree-nuts', 'soy', 'wheat', 'sesame', 'none'
      specificAllergies: String, // free text for specific allergies
      intolerances: [String]
    },
    
    // Step 7: Food Preferences - Cuisines (EXPANDED)
    foodPreferences: {
      favoriteCuisines: [String],
      mealComplexity: String, // 'simple', 'moderate', 'complex'
      proteinPreferences: [String], // 'tofu', 'tempeh', 'seitan', 'legumes', 'nuts-seeds', 'protein-powder', 'whole-grains'
      milkAlternatives: [String], // 'soy', 'almond', 'oat', 'coconut', 'rice', 'cashew'
      preferredIngredients: [String],
      dislikedIngredients: [String],
      spiceTolerance: String, // 'none', 'mild', 'medium', 'hot', 'very-hot'
      sweetnessPreference: String, // 'low', 'medium', 'high'
      saltinessPreference: String, // 'low', 'medium', 'high'
      mealTemperature: String, // 'hot', 'room-temp', 'cold', 'mix'
      texturePreferences: [String], // 'crunchy', 'creamy', 'chewy', 'soft', 'crispy'
      flavorProfiles: [String] // 'spicy', 'sweet', 'savory', 'sour', 'umami'
    },
    
    // Step 8: Meal Timing & Frequency (NEW)
    mealTiming: {
      breakfastTime: String,
      lunchTime: String,
      dinnerTime: String,
      intermittentFasting: Boolean,
      fastingWindow: String, // '16:8', '18:6', '20:4', etc.
      mealsPerDay: Number,
      snacksBetweenMeals: Boolean,
      mealSizes: String, // 'small-frequent', '3-regular', '2-large'
      eatingSchedule: String // 'consistent', 'flexible', 'irregular'
    },
    
    // Step 9: Cooking Skills & Experience (EXPANDED)
    cooking: {
      skillLevel: String, // 'beginner', 'intermediate', 'advanced'
      cookingFrequency: String, // 'daily', '4-6-week', '2-3-week', 'rarely', 'never'
      favoriteMethods: [String], // 'stovetop', 'oven', 'grilling', 'steaming', 'raw', 'air-frying', 'pressure-cooking'
      timeAvailable: Number, // minutes
      equipment: [String],
      mealPrepRoutine: Boolean,
      mealPrepDay: String, // 'sunday', 'saturday', etc.
      storageCapacity: String, // 'large', 'standard', 'limited'
      busiestDays: [String], // days when quick meals needed
      cookingConfidence: Number // 1-10 scale
    },
    
    // Step 10: Meal Planning Preferences (EXPANDED)
    mealPlanning: {
      preferences: [String], // 'quick', 'batch', 'gourmet', 'comfort', 'healthy', 'international'
      leftoverPreference: String, // 'love', 'okay', 'prefer-fresh'
      recipeVariety: String, // 'try-new', 'stick-favorites', 'mix'
      mealTypes: [String],
      planningHorizon: String, // 'daily', 'weekly', 'biweekly', 'monthly'
      flexibilityLevel: String // 'strict', 'flexible', 'very-flexible'
    },
    
    // Step 11: Nutrition Goals (EXPANDED)
    nutrition: {
      primaryGoal: String,
      calorieTarget: Number,
      macroFocus: String, // 'high-protein', 'high-carb', 'balanced', 'low-carb', 'high-fat'
      proteinTarget: Number, // grams per day
      carbTarget: Number,
      fatTarget: Number,
      micronutrientConcerns: [String], // 'iron', 'b12', 'calcium', 'vitamin-d', 'omega-3', 'zinc', 'iodine'
      trackNutrition: Boolean,
      nutritionPriority: String // 'calories', 'macros', 'micros', 'whole-foods', 'not-tracking'
    },
    
    // Step 12: Fitness & Activity (NEW)
    fitness: {
      activityLevel: String, // 'sedentary', 'lightly-active', 'moderately-active', 'very-active', 'athlete'
      exerciseRoutine: [String], // 'cardio', 'strength', 'yoga', 'sports', 'none'
      exerciseFrequency: String, // 'daily', '4-6-week', '2-3-week', 'rarely', 'never'
      exerciseDuration: Number, // minutes per session
      fitnessGoals: [String], // 'weight-loss', 'muscle-gain', 'endurance', 'flexibility', 'general-fitness'
      preworkoutMeal: Boolean,
      postworkoutMeal: Boolean,
      athleticPerformance: Boolean
    },
    
    // Step 13: Budget & Shopping (EXPANDED)
    budget: {
      level: String, // 'low', 'medium', 'high'
      weeklyBudget: Number, // optional specific amount
      shoppingFrequency: String, // 'daily', 'weekly', 'biweekly', 'monthly'
      preferredLocations: [String], // 'supermarket', 'farmers-market', 'bulk-stores', 'online', 'multiple'
      organicPreference: String, // 'always', 'when-possible', 'not-important'
      seasonalEating: Boolean,
      bulkBuying: Boolean,
      mealCostPriority: String, // 'minimize-cost', 'balance', 'quality-first'
      shoppingPreference: String
    },
    
    // Step 14: Social & Lifestyle (NEW)
    lifestyle: {
      eatOutFrequency: String, // 'daily', 'weekly', 'monthly', 'rarely', 'never'
      cookForNonVegans: Boolean,
      nonVeganHousehold: Boolean,
      socialChallenges: [String], // 'family-gatherings', 'work-events', 'restaurants', 'travel', 'none'
      supportSystem: [String], // 'family-support', 'friends-support', 'solo', 'online-community'
      entertainingFrequency: String, // 'often', 'sometimes', 'rarely', 'never'
      workSchedule: String, // 'regular', 'shift-work', 'irregular', 'work-from-home'
      travelFrequency: String // 'frequent', 'occasional', 'rare', 'never'
    },
    
    // Step 15: Learning & Growth (NEW)
    learning: {
      nutritionEducation: Boolean,
      cookingTutorials: Boolean,
      mealPlanningTips: Boolean,
      interests: [String], // 'nutrition-basics', 'meal-prep', 'budget-shopping', 'restaurant-tips', 'baking', 'fermentation', 'sprouting'
      learningStyle: String, // 'video', 'written', 'interactive', 'all'
      communityEngagement: Boolean,
      shareRecipes: Boolean
    },
    
    // Step 16: Environmental & Ethical (NEW)
    environmental: {
      carbonFootprintConcern: Boolean,
      localSourcing: Boolean,
      wasteReduction: Boolean,
      packagingConcern: Boolean,
      ethicalBrands: Boolean,
      sustainabilityPriority: String // 'high', 'medium', 'low'
    },
    
    // Step 17: Time Management (NEW)
    timeManagement: {
      morningRoutine: String, // 'rushed', 'moderate', 'relaxed'
      eveningRoutine: String,
      weekdayAvailability: Number, // minutes for cooking
      weekendAvailability: Number,
      preferredCookingTime: String, // 'morning', 'afternoon', 'evening', 'flexible'
      multitasking: Boolean // cook while doing other things
    },
    
    // Step 18: Food Waste & Storage (NEW)
    foodManagement: {
      wasteReduction: Boolean,
      composting: Boolean,
      freezerUsage: String, // 'frequent', 'occasional', 'rare'
      pantrySize: String, // 'large', 'medium', 'small'
      refrigeratorSize: String,
      storageOrganization: String // 'very-organized', 'somewhat', 'needs-improvement'
    },
    
    // Step 19: Special Occasions (NEW)
    specialOccasions: {
      holidayMeals: Boolean,
      birthdayPreferences: String,
      entertainingStyle: String, // 'formal', 'casual', 'potluck', 'none'
      culturalConsiderations: [String],
      celebrationImportance: String // 'very-important', 'somewhat', 'not-important'
    },
    
    // Step 20: Technology & Tools (NEW)
    technology: {
      smartKitchenDevices: [String], // 'smart-oven', 'instant-pot', 'air-fryer', 'sous-vide', 'none'
      mealPlanningApps: Boolean,
      nutritionTracking: Boolean,
      groceryListApps: Boolean,
      recipeApps: Boolean,
      techComfort: String // 'very-comfortable', 'comfortable', 'basic', 'prefer-simple'
    },
    
    // Step 21: Additional Notes & Goals
    additionalInfo: {
      notes: String,
      shortTermGoals: String, // 30-day goals
      mediumTermGoals: String, // 60-day goals
      longTermGoals: String, // 90-day goals
      specificRequests: String,
      inspirationSources: [String], // 'cookbooks', 'youtube', 'instagram', 'blogs', 'friends'
    },
    
    // Step 22: Automation & Preferences (kept from original)
    automation: {
      enabled: {
        type: Boolean,
        default: false
      },
      startDay: String,
      daysInAdvance: Number,
      notifications: {
        type: Boolean,
        default: false
      },
      notificationTime: String,
      recurringPreferences: [String],
      varietyPreference: String
    }
  },
  
  // Saved items
  savedMenus: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  }],
  savedDishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  }],
  favoriteWeeklyMenus: [{
    name: String,
    menu: mongoose.Schema.Types.Mixed,
    savedAt: Date
  }],
  
  // Legacy fields for backward compatibility
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: [Number],
    address: String
  },
  preferences: {
    dietaryRestrictions: [String],
    favoriteIngredients: [String],
    dislikedIngredients: [String]
  }
}, {
  timestamps: true,
  minimize: false // Keep empty objects
});

// Index for geospatial queries
userSchema.index({ location: '2dsphere' });
userSchema.index({ 'profile.personal.location': '2dsphere' });
userSchema.index({ firebaseUid: 1 });

// Hash password before saving (for email/password auth)
userSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate nutritional needs
userSchema.methods.calculateNutritionalNeeds = function() {
  if (!this.profile.people || this.profile.people.length === 0) {
    return { calories: 2000, protein: 50, carbs: 250, fat: 65 };
  }
  
  const totalNeeds = this.profile.people.reduce((acc, person) => {
    // Mifflin-St Jeor Equation for BMR
    let bmr;
    if (person.gender === 'male') {
      bmr = 10 * person.weight + 6.25 * person.height - 5 * (person.age || 30) + 5;
    } else {
      bmr = 10 * person.weight + 6.25 * person.height - 5 * (person.age || 30) - 161;
    }
    
    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      'very active': 1.725,
      athlete: 1.9
    };
    const multiplier = activityMultipliers[person.activityLevel] || 1.5;
    
    // Appetite adjustment
    const appetiteMultipliers = {
      small: 0.85,
      medium: 1.0,
      large: 1.15,
      'very large': 1.3
    };
    const appetiteMultiplier = appetiteMultipliers[person.appetiteSize] || 1.0;
    
    const tdee = bmr * multiplier * appetiteMultiplier;
    
    return {
      calories: acc.calories + tdee,
      protein: acc.protein + (tdee * 0.15 / 4), // 15% of calories from protein
      carbs: acc.carbs + (tdee * 0.55 / 4), // 55% from carbs
      fat: acc.fat + (tdee * 0.30 / 9) // 30% from fat
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  
  return totalNeeds;
};

// Method to check if profile is complete
userSchema.methods.isProfileComplete = function() {
  return this.onboardingCompleted && 
         this.profile.personal && 
         this.profile.people && 
         this.profile.people.length > 0;
};

module.exports = mongoose.model('User', userSchema);
