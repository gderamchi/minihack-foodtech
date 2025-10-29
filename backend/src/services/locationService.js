const Store = require('../models/Store');

class LocationService {
  /**
   * Find stores near a location
   * @param {Number} longitude 
   * @param {Number} latitude 
   * @param {Number} maxDistance - Maximum distance in meters (default 5000m = 5km)
   * @returns {Array} Nearby stores
   */
  async findNearbyStores(longitude, latitude, maxDistance = 5000) {
    try {
      const stores = await Store.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance
          }
        }
      }).limit(20);

      return stores;
    } catch (error) {
      console.error('Error finding nearby stores:', error);
      throw new Error('Failed to find nearby stores');
    }
  }

  /**
   * Find stores that have specific ingredients
   * @param {Array} ingredientIds - Array of ingredient IDs
   * @param {Number} longitude 
   * @param {Number} latitude 
   * @param {Number} maxDistance 
   * @returns {Array} Stores with ingredients
   */
  async findStoresWithIngredients(ingredientIds, longitude, latitude, maxDistance = 5000) {
    try {
      const stores = await Store.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance
          }
        },
        availableIngredients: { $in: ingredientIds }
      })
      .populate('availableIngredients')
      .limit(20);

      // Calculate how many of the requested ingredients each store has
      const storesWithCoverage = stores.map(store => {
        const availableCount = store.availableIngredients.filter(ing =>
          ingredientIds.includes(ing._id.toString())
        ).length;

        return {
          ...store.toObject(),
          ingredientCoverage: availableCount,
          coveragePercentage: (availableCount / ingredientIds.length) * 100
        };
      });

      // Sort by coverage percentage
      storesWithCoverage.sort((a, b) => b.coveragePercentage - a.coveragePercentage);

      return storesWithCoverage;
    } catch (error) {
      console.error('Error finding stores with ingredients:', error);
      throw new Error('Failed to find stores with ingredients');
    }
  }

  /**
   * Calculate distance between two points (Haversine formula)
   * @param {Number} lon1 
   * @param {Number} lat1 
   * @param {Number} lon2 
   * @param {Number} lat2 
   * @returns {Number} Distance in meters
   */
  calculateDistance(lon1, lat1, lon2, lat2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Get store recommendations for a dish
   * @param {Object} dish - Dish object with ingredients
   * @param {Number} longitude 
   * @param {Number} latitude 
   * @returns {Object} Store recommendations
   */
  async getStoreRecommendationsForDish(dish, longitude, latitude) {
    try {
      if (!dish.ingredients || dish.ingredients.length === 0) {
        return {
          stores: [],
          message: 'No ingredients found for this dish'
        };
      }

      // Extract ingredient IDs
      const ingredientIds = dish.ingredients
        .filter(ing => ing.ingredient)
        .map(ing => ing.ingredient.toString());

      if (ingredientIds.length === 0) {
        return {
          stores: [],
          message: 'No valid ingredients found'
        };
      }

      // Find stores with these ingredients
      const stores = await this.findStoresWithIngredients(
        ingredientIds,
        longitude,
        latitude,
        10000 // 10km radius
      );

      return {
        stores,
        totalIngredients: ingredientIds.length,
        message: stores.length > 0 
          ? `Found ${stores.length} stores nearby` 
          : 'No stores found with these ingredients nearby'
      };
    } catch (error) {
      console.error('Error getting store recommendations:', error);
      throw new Error('Failed to get store recommendations');
    }
  }

  /**
   * Search stores by name or location
   * @param {String} query 
   * @param {Number} longitude 
   * @param {Number} latitude 
   * @returns {Array} Matching stores
   */
  async searchStores(query, longitude = null, latitude = null) {
    try {
      let searchQuery = {
        $text: { $search: query }
      };

      if (longitude !== null && latitude !== null) {
        const stores = await Store.find(searchQuery)
          .limit(20);

        // Calculate distances and sort
        const storesWithDistance = stores.map(store => {
          const distance = this.calculateDistance(
            longitude,
            latitude,
            store.location.coordinates[0],
            store.location.coordinates[1]
          );

          return {
            ...store.toObject(),
            distance: Math.round(distance)
          };
        });

        storesWithDistance.sort((a, b) => a.distance - b.distance);
        return storesWithDistance;
      }

      return await Store.find(searchQuery).limit(20);
    } catch (error) {
      console.error('Error searching stores:', error);
      throw new Error('Failed to search stores');
    }
  }
}

module.exports = new LocationService();
