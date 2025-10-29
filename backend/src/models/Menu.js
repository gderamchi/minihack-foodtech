const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['base', 'community', 'referenced'],
    default: 'base'
  },
  dishes: [{
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish'
    },
    category: {
      type: String,
      enum: ['starter', 'main', 'side', 'dessert', 'drink'],
      default: 'main'
    }
  }],
  isVegan: {
    type: Boolean,
    default: false
  },
  cuisine: String,
  occasion: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'special-occasion'],
    default: 'lunch'
  },
  tags: [String],
  source: {
    type: String,
    enum: ['manual', 'community', 'marmiton', 'other'],
    default: 'manual'
  },
  sourceUrl: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  imageUrl: String,
  totalPrepTime: Number, // in minutes
  totalCookTime: Number, // in minutes
  servings: Number,
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
  isPublished: {
    type: Boolean,
    default: true
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
menuSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Update averageRating when ratings change
menuSchema.methods.updateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
};

module.exports = mongoose.model('Menu', menuSchema);
