const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  ingredients: [{
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient'
    },
    name: String,
    quantity: String,
    isVegan: Boolean
  }],
  instructions: [String],
  prepTime: Number, // in minutes
  cookTime: Number, // in minutes
  servings: Number,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  cuisine: String,
  tags: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  imageUrl: String,
  veganAlternative: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  },
  originalDish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  },
  generatedByAI: {
    type: Boolean,
    default: false
  },
  aiPrompt: String,
  source: {
    type: String,
    enum: ['manual', 'community', 'marmiton', 'ai-generated'],
    default: 'manual'
  },
  sourceUrl: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Text index for search
dishSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Update averageRating when ratings change
dishSchema.methods.updateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
};

module.exports = mongoose.model('Dish', dishSchema);
