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
  
  // Onboarding status
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  onboardingStep: {
    type: Number,
    default: 0
  },
  
  // Profile data
  profile: {
    // Step 1: Personal Information
    personal: {
      age: Number,
      location: {
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: [Number],
        address: String
      },
      householdSize: Number,
      householdType: String
    },
    
    // Step 2: Physical Profile (for each person)
    people: [personSchema],
    
    // Step 3: Dietary Restrictions & Allergies
    dietary: {
      restrictions: [String],
      allergies: [String],
      intolerances: [String]
    },
    
    // Step 4: Food Preferences
    foodPreferences: {
      favoriteCuisines: [String],
      dislikedIngredients: [String],
      preferredIngredients: [String],
      spiceTolerance: String,
      texturePreferences: [String],
      flavorProfiles: [String]
    },
    
    // Step 5: Cooking Habits
    cooking: {
      skillLevel: String,
      timeAvailable: Number,
      frequency: String,
      equipment: [String],
      mealPrepPreference: String
    },
    
    // Step 6: Meal Planning Preferences
    mealPlanning: {
      mealsPerDay: Number,
      mealTypes: [String],
      budget: String,
      shoppingPreference: String,
      leftoverPreference: String
    },
    
    // Step 7: Health & Nutrition Goals
    health: {
      primaryGoal: String,
      calorieTarget: Number,
      macroPreferences: String,
      nutritionalFocus: [String]
    },
    
    // Step 8: Automation & Preferences
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
