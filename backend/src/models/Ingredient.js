const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['vegetable', 'fruit', 'grain', 'legume', 'nut', 'seed', 'spice', 'dairy-alternative', 'protein', 'oil', 'sweetener', 'other'],
    required: true
  },
  isVegan: {
    type: Boolean,
    default: true
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  commonSubstitutes: [{
    type: String
  }],
  seasonality: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Text index for search
ingredientSchema.index({ name: 'text' });

module.exports = mongoose.model('Ingredient', ingredientSchema);
