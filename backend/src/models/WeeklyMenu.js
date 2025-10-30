const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  dish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  },
  customDish: {
    name: String,
    description: String,
    ingredients: [{
      name: String,
      quantity: String
    }],
    instructions: [String],
    prepTime: Number,
    cookTime: Number,
    servings: Number
  },
  adjustedServings: Number,
  adjustedIngredients: [{
    name: String,
    quantity: String,
    originalQuantity: String
  }]
}, { _id: false });

const dayMenuSchema = new mongoose.Schema({
  breakfast: mealSchema,
  lunch: mealSchema,
  dinner: mealSchema,
  snacks: [mealSchema]
}, { _id: false });

const shoppingItemSchema = new mongoose.Schema({
  ingredient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient'
  },
  name: {
    type: String,
    required: true
  },
  quantity: String,
  unit: String,
  checked: {
    type: Boolean,
    default: false
  },
  notes: String,
  price: Number,
  availableAt: [{
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store'
    },
    storeName: String,
    price: Number,
    inStock: Boolean
  }]
}, { _id: false });

const weeklyMenuSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  weekStart: {
    type: Date,
    required: true
  },
  weekEnd: {
    type: Date,
    required: true
  },
  
  menu: {
    monday: dayMenuSchema,
    tuesday: dayMenuSchema,
    wednesday: dayMenuSchema,
    thursday: dayMenuSchema,
    friday: dayMenuSchema,
    saturday: dayMenuSchema,
    sunday: dayMenuSchema
  },
  
  shoppingList: {
    byCategory: [{
      category: {
        type: String,
        enum: ['produce', 'grains', 'proteins', 'dairy-alternatives', 'spices', 'condiments', 'frozen', 'canned', 'other']
      },
      items: [shoppingItemSchema]
    }],
    
    byStore: [{
      store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
      },
      storeName: String,
      items: [shoppingItemSchema],
      totalCost: Number
    }],
    
    totalCost: Number,
    missingItems: [String]
  },
  
  template: {
    type: String,
    enum: ['quick-easy', 'gourmet', 'budget-friendly', 'high-protein', 'meal-prep', 'family-friendly', 'athletic', 'custom']
  },
  
  isFavorite: {
    type: Boolean,
    default: false
  },
  
  favoriteName: String,
  
  customizations: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    meal: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snacks']
    },
    originalDish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish'
    },
    reason: String,
    feedback: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  nutritionSummary: {
    daily: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number
    },
    weekly: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number
    }
  },
  
  generatedBy: {
    type: String,
    enum: ['ai', 'manual', 'template'],
    default: 'ai'
  },
  
  generatedAt: {
    type: Date,
    default: Date.now
  },
  
  lastModified: {
    type: Date,
    default: Date.now
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
weeklyMenuSchema.index({ user: 1, weekStart: 1 });
weeklyMenuSchema.index({ user: 1, isActive: 1 });
weeklyMenuSchema.index({ weekStart: 1, weekEnd: 1 });

// Update lastModified on save
weeklyMenuSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Method to calculate nutrition summary
weeklyMenuSchema.methods.calculateNutritionSummary = async function() {
  await this.populate('menu.monday.breakfast.dish menu.monday.lunch.dish menu.monday.dinner.dish');
  // ... populate all days
  
  let weeklyTotals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  let dayCount = 0;
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  for (const day of days) {
    if (!this.menu[day]) continue;
    
    let dayTotals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    
    const meals = ['breakfast', 'lunch', 'dinner'];
    for (const meal of meals) {
      if (this.menu[day][meal] && this.menu[day][meal].dish) {
        const dish = this.menu[day][meal].dish;
        if (dish.nutritionalInfo) {
          dayTotals.calories += dish.nutritionalInfo.calories || 0;
          dayTotals.protein += dish.nutritionalInfo.protein || 0;
          dayTotals.carbs += dish.nutritionalInfo.carbs || 0;
          dayTotals.fat += dish.nutritionalInfo.fat || 0;
          dayTotals.fiber += dish.nutritionalInfo.fiber || 0;
        }
      }
    }
    
    weeklyTotals.calories += dayTotals.calories;
    weeklyTotals.protein += dayTotals.protein;
    weeklyTotals.carbs += dayTotals.carbs;
    weeklyTotals.fat += dayTotals.fat;
    weeklyTotals.fiber += dayTotals.fiber;
    dayCount++;
  }
  
  this.nutritionSummary = {
    daily: {
      calories: Math.round(weeklyTotals.calories / dayCount),
      protein: Math.round(weeklyTotals.protein / dayCount),
      carbs: Math.round(weeklyTotals.carbs / dayCount),
      fat: Math.round(weeklyTotals.fat / dayCount),
      fiber: Math.round(weeklyTotals.fiber / dayCount)
    },
    weekly: weeklyTotals
  };
  
  return this.nutritionSummary;
};

// Method to get shopping list summary
weeklyMenuSchema.methods.getShoppingListSummary = function() {
  const totalItems = this.shoppingList.byCategory.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedItems = this.shoppingList.byCategory.reduce((sum, cat) => 
    sum + cat.items.filter(item => item.checked).length, 0
  );
  
  return {
    totalItems,
    checkedItems,
    remainingItems: totalItems - checkedItems,
    totalCost: this.shoppingList.totalCost || 0,
    missingItemsCount: this.shoppingList.missingItems.length
  };
};

module.exports = mongoose.model('WeeklyMenu', weeklyMenuSchema);
