const Store = require('../models/Store');

class ShoppingListGenerator {
  /**
   * Generate shopping list from weekly menu
   */
  async generateShoppingList(weeklyMenu, userLocation) {
    try {
      // Collect all ingredients from all meals
      const allIngredients = this.collectIngredients(weeklyMenu);
      
      // Group and consolidate ingredients
      const consolidatedIngredients = this.consolidateIngredients(allIngredients);
      
      // Categorize ingredients
      const categorizedList = this.categorizeIngredients(consolidatedIngredients);
      
      // Find stores that have these ingredients
      const storesWithIngredients = await this.findStoresForIngredients(
        consolidatedIngredients,
        userLocation
      );
      
      // Organize by store
      const byStore = this.organizeByStore(consolidatedIngredients, storesWithIngredients);
      
      return {
        byCategory: categorizedList,
        byStore,
        allIngredients: consolidatedIngredients,
        totalItems: consolidatedIngredients.length,
        estimatedCost: this.estimateCost(consolidatedIngredients),
        nearbyStores: storesWithIngredients
      };
    } catch (error) {
      console.error('Error generating shopping list:', error);
      throw error;
    }
  }

  /**
   * Collect all ingredients from weekly menu
   */
  collectIngredients(weeklyMenu) {
    const ingredients = [];
    
    weeklyMenu.days.forEach(day => {
      day.meals.forEach(meal => {
        if (meal.dishDetails && meal.dishDetails.ingredients) {
          meal.dishDetails.ingredients.forEach(ingredient => {
            ingredients.push({
              name: ingredient.name,
              quantity: ingredient.quantity || '1',
              unit: ingredient.unit || '',
              day: day.day,
              mealType: meal.mealType,
              dishName: meal.dishDetails.name
            });
          });
        }
      });
    });
    
    return ingredients;
  }

  /**
   * Consolidate duplicate ingredients
   */
  consolidateIngredients(ingredients) {
    const consolidated = {};
    
    ingredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase().trim();
      
      if (!consolidated[key]) {
        consolidated[key] = {
          name: ingredient.name,
          quantities: [],
          usedIn: [],
          category: this.categorizeIngredient(ingredient.name)
        };
      }
      
      consolidated[key].quantities.push({
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        day: ingredient.day,
        mealType: ingredient.mealType
      });
      
      if (!consolidated[key].usedIn.includes(ingredient.dishName)) {
        consolidated[key].usedIn.push(ingredient.dishName);
      }
    });
    
    // Convert to array and calculate total quantities
    return Object.values(consolidated).map(item => ({
      ...item,
      totalQuantity: this.sumQuantities(item.quantities),
      occurrences: item.quantities.length
    }));
  }

  /**
   * Sum quantities (simple version - can be enhanced)
   */
  sumQuantities(quantities) {
    // For now, just list all quantities
    // In production, you'd want to properly sum compatible units
    return quantities.map(q => `${q.quantity} ${q.unit}`.trim()).join(', ');
  }

  /**
   * Categorize a single ingredient
   */
  categorizeIngredient(ingredientName) {
    const name = ingredientName.toLowerCase();
    
    const categories = {
      'Produce': ['lettuce', 'tomato', 'onion', 'garlic', 'pepper', 'carrot', 'celery', 'spinach', 'kale', 'broccoli', 'cauliflower', 'cucumber', 'zucchini', 'mushroom', 'avocado', 'potato', 'sweet potato', 'apple', 'banana', 'berry', 'lemon', 'lime', 'orange', 'ginger', 'herb', 'basil', 'cilantro', 'parsley'],
      'Grains & Pasta': ['rice', 'pasta', 'quinoa', 'oats', 'bread', 'flour', 'couscous', 'bulgur', 'barley', 'noodle'],
      'Proteins': ['tofu', 'tempeh', 'seitan', 'beans', 'lentils', 'chickpeas', 'edamame', 'peas', 'protein powder'],
      'Dairy Alternatives': ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'almond milk', 'soy milk', 'oat milk', 'coconut milk'],
      'Pantry Staples': ['oil', 'vinegar', 'sauce', 'paste', 'stock', 'broth', 'salt', 'pepper', 'spice', 'sugar', 'syrup', 'honey', 'tahini', 'peanut butter', 'almond butter'],
      'Nuts & Seeds': ['nuts', 'almonds', 'walnuts', 'cashews', 'pecans', 'seeds', 'chia', 'flax', 'sesame', 'sunflower', 'pumpkin'],
      'Canned & Jarred': ['canned', 'jarred', 'pickled', 'olives', 'capers'],
      'Frozen': ['frozen'],
      'Baking': ['baking powder', 'baking soda', 'yeast', 'vanilla', 'cocoa', 'chocolate'],
      'Condiments': ['ketchup', 'mustard', 'mayo', 'hot sauce', 'soy sauce', 'tamari', 'miso', 'nutritional yeast']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        return category;
      }
    }
    
    return 'Other';
  }

  /**
   * Categorize all ingredients
   */
  categorizeIngredients(ingredients) {
    const categorized = {};
    
    ingredients.forEach(ingredient => {
      const category = ingredient.category;
      
      if (!categorized[category]) {
        categorized[category] = [];
      }
      
      categorized[category].push(ingredient);
    });
    
    // Sort categories
    const sortedCategories = [
      'Produce',
      'Proteins',
      'Grains & Pasta',
      'Dairy Alternatives',
      'Nuts & Seeds',
      'Pantry Staples',
      'Condiments',
      'Canned & Jarred',
      'Frozen',
      'Baking',
      'Other'
    ];
    
    const result = {};
    sortedCategories.forEach(category => {
      if (categorized[category]) {
        result[category] = categorized[category];
      }
    });
    
    return result;
  }

  /**
   * Find stores that have these ingredients
   */
  async findStoresForIngredients(ingredients, userLocation) {
    try {
      if (!userLocation || !userLocation.coordinates) {
        return [];
      }

      const [longitude, latitude] = userLocation.coordinates;
      
      // Find nearby stores
      const stores = await Store.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: 10000 // 10km
          }
        }
      }).limit(10);

      // For each store, estimate which ingredients they likely have
      return stores.map(store => ({
        store: {
          id: store._id,
          name: store.name,
          address: store.address,
          distance: this.calculateDistance(
            latitude,
            longitude,
            store.location.coordinates[1],
            store.location.coordinates[0]
          ),
          tags: store.tags || []
        },
        availableIngredients: this.estimateStoreInventory(store, ingredients)
      }));
    } catch (error) {
      console.error('Error finding stores:', error);
      return [];
    }
  }

  /**
   * Estimate which ingredients a store likely has
   */
  estimateStoreInventory(store, ingredients) {
    const storeTags = (store.tags || []).map(t => t.toLowerCase());
    const storeName = store.name.toLowerCase();
    
    // Stores that typically have everything
    const fullServiceStores = ['supermarket', 'grocery', 'whole foods', 'trader joe'];
    const isFullService = fullServiceStores.some(keyword => 
      storeName.includes(keyword) || storeTags.includes(keyword)
    );
    
    if (isFullService) {
      return ingredients.map(ing => ing.name);
    }
    
    // Specialty stores
    const available = [];
    
    ingredients.forEach(ingredient => {
      const category = ingredient.category.toLowerCase();
      const name = ingredient.name.toLowerCase();
      
      // Health food stores
      if (storeTags.includes('health') || storeTags.includes('organic')) {
        if (['produce', 'proteins', 'grains & pasta', 'nuts & seeds'].some(c => category.includes(c))) {
          available.push(ingredient.name);
        }
      }
      
      // Farmers markets
      if (storeTags.includes('farmers') || storeTags.includes('market')) {
        if (category.includes('produce')) {
          available.push(ingredient.name);
        }
      }
      
      // Asian markets
      if (storeTags.includes('asian') || storeName.includes('asian')) {
        if (name.includes('tofu') || name.includes('rice') || name.includes('noodle')) {
          available.push(ingredient.name);
        }
      }
    });
    
    return available;
  }

  /**
   * Organize ingredients by store
   */
  organizeByStore(ingredients, storesWithIngredients) {
    const byStore = {};
    
    storesWithIngredients.forEach(storeData => {
      const storeName = storeData.store.name;
      byStore[storeName] = {
        store: storeData.store,
        ingredients: ingredients.filter(ing => 
          storeData.availableIngredients.includes(ing.name)
        )
      };
    });
    
    return byStore;
  }

  /**
   * Estimate total cost (rough estimate)
   */
  estimateCost(ingredients) {
    // Very rough estimates per category
    const avgPrices = {
      'Produce': 2.5,
      'Proteins': 4.0,
      'Grains & Pasta': 3.0,
      'Dairy Alternatives': 3.5,
      'Nuts & Seeds': 5.0,
      'Pantry Staples': 4.0,
      'Condiments': 3.0,
      'Canned & Jarred': 2.0,
      'Frozen': 3.5,
      'Baking': 3.0,
      'Other': 3.0
    };
    
    let total = 0;
    ingredients.forEach(ingredient => {
      total += avgPrices[ingredient.category] || 3.0;
    });
    
    return {
      estimated: Math.round(total * 100) / 100,
      currency: 'USD',
      note: 'This is a rough estimate. Actual prices may vary.'
    };
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }
}

module.exports = new ShoppingListGenerator();
