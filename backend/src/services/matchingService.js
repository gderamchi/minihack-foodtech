const Dish = require('../models/Dish');

class MatchingService {
  /**
   * Find matching vegan dishes in the database
   * @param {String} dishName - Name of the dish to match
   * @param {Array} ingredients - List of ingredients
   * @returns {Array} Matching dishes
   */
  async findMatchingVeganDishes(dishName, ingredients = []) {
    try {
      // First, try exact name match
      let matches = await Dish.find({
        name: { $regex: new RegExp(dishName, 'i') },
        isVegan: true
      }).limit(5);

      if (matches.length > 0) {
        return matches;
      }

      // If no exact match, try text search
      matches = await Dish.find(
        { 
          $text: { $search: dishName },
          isVegan: true
        },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } })
      .limit(5);

      if (matches.length > 0) {
        return matches;
      }

      // If still no match, try ingredient-based matching
      if (ingredients.length > 0) {
        const ingredientNames = ingredients.map(ing => 
          typeof ing === 'string' ? ing : ing.name
        );

        matches = await Dish.find({
          isVegan: true,
          'ingredients.name': { 
            $in: ingredientNames.map(name => new RegExp(name, 'i'))
          }
        }).limit(5);
      }

      return matches;
    } catch (error) {
      console.error('Error finding matching dishes:', error);
      return [];
    }
  }

  /**
   * Calculate similarity score between two dishes
   * @param {Object} dish1 
   * @param {Object} dish2 
   * @returns {Number} Similarity score (0-1)
   */
  calculateSimilarity(dish1, dish2) {
    let score = 0;
    let factors = 0;

    // Name similarity
    if (dish1.name && dish2.name) {
      const name1 = dish1.name.toLowerCase();
      const name2 = dish2.name.toLowerCase();
      if (name1.includes(name2) || name2.includes(name1)) {
        score += 0.3;
      }
      factors++;
    }

    // Cuisine similarity
    if (dish1.cuisine && dish2.cuisine && dish1.cuisine === dish2.cuisine) {
      score += 0.2;
      factors++;
    }

    // Ingredient overlap
    if (dish1.ingredients && dish2.ingredients) {
      const ingredients1 = dish1.ingredients.map(ing => 
        (ing.name || ing).toLowerCase()
      );
      const ingredients2 = dish2.ingredients.map(ing => 
        (ing.name || ing).toLowerCase()
      );

      const commonIngredients = ingredients1.filter(ing1 =>
        ingredients2.some(ing2 => ing1.includes(ing2) || ing2.includes(ing1))
      );

      const overlapRatio = commonIngredients.length / Math.max(ingredients1.length, ingredients2.length);
      score += overlapRatio * 0.5;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Find the best matching vegan alternative
   * @param {Object} originalDish 
   * @returns {Object|null} Best matching dish or null
   */
  async findBestMatch(originalDish) {
    const matches = await this.findMatchingVeganDishes(
      originalDish.name,
      originalDish.ingredients
    );

    if (matches.length === 0) {
      return null;
    }

    // Calculate similarity scores and find the best match
    const scoredMatches = matches.map(match => ({
      dish: match,
      score: this.calculateSimilarity(originalDish, match)
    }));

    scoredMatches.sort((a, b) => b.score - a.score);

    // Return the best match if score is above threshold
    if (scoredMatches[0].score > 0.3) {
      return scoredMatches[0].dish;
    }

    return null;
  }

  /**
   * Check if a dish already exists in the database
   * @param {String} dishName 
   * @returns {Object|null} Existing dish or null
   */
  async checkDishExists(dishName) {
    try {
      const dish = await Dish.findOne({
        name: { $regex: new RegExp(`^${dishName}$`, 'i') }
      });
      return dish;
    } catch (error) {
      console.error('Error checking dish existence:', error);
      return null;
    }
  }
}

module.exports = new MatchingService();
