const blackboxService = require('./blackboxService');
const axios = require('axios');

class IngredientMatchingService {
  constructor() {
    // Cache for ingredient-store type mappings
    this.ingredientCache = new Map();
    
    // Common ingredient categories
    this.ingredientCategories = {
      'common': ['onion', 'garlic', 'tomato', 'potato', 'carrot', 'rice', 'pasta', 'oil', 'salt', 'pepper'],
      'specialty_vegan': ['nutritional yeast', 'tempeh', 'seitan', 'tahini', 'miso', 'tamari', 'vegan cheese', 'vegan butter'],
      'organic_preferred': ['tofu', 'quinoa', 'chia seeds', 'flax seeds', 'hemp seeds', 'spirulina'],
      'fresh_produce': ['spinach', 'kale', 'lettuce', 'cucumber', 'bell pepper', 'zucchini', 'eggplant'],
      'grains_legumes': ['chickpeas', 'lentils', 'beans', 'quinoa', 'bulgur', 'couscous'],
      'spices': ['cumin', 'coriander', 'turmeric', 'paprika', 'cinnamon', 'ginger']
    };
  }

  /**
   * Analyze ingredients and recommend best stores using AI
   */
  async analyzeIngredientsForStores(ingredients, stores) {
    try {
      // Categorize ingredients
      const categorized = this.categorizeIngredients(ingredients);
      
      // Score each store based on ingredient categories
      const scoredStores = stores.map(store => {
        const score = this.calculateStoreScore(store, categorized);
        const coverage = this.estimateCoverage(store, categorized);
        
        return {
          ...store,
          ingredientScore: score,
          estimatedCoverage: coverage,
          recommendationReason: this.generateRecommendationReason(store, categorized)
        };
      });

      // Sort by score (highest first)
      scoredStores.sort((a, b) => b.ingredientScore - a.ingredientScore);

      // Use AI for specialty ingredients if needed
      if (categorized.specialty_vegan.length > 0) {
        await this.enhanceWithAI(scoredStores, categorized.specialty_vegan);
      }

      return scoredStores;
    } catch (error) {
      console.error('Error analyzing ingredients:', error);
      return stores; // Return original stores if analysis fails
    }
  }

  /**
   * Categorize ingredients into groups
   */
  categorizeIngredients(ingredients) {
    const categorized = {
      common: [],
      specialty_vegan: [],
      organic_preferred: [],
      fresh_produce: [],
      grains_legumes: [],
      spices: [],
      unknown: []
    };

    for (const ingredient of ingredients) {
      const name = (ingredient.name || ingredient).toLowerCase();
      let categorized_flag = false;

      for (const [category, keywords] of Object.entries(this.ingredientCategories)) {
        if (keywords.some(keyword => name.includes(keyword))) {
          categorized[category].push(ingredient);
          categorized_flag = true;
          break;
        }
      }

      if (!categorized_flag) {
        categorized.unknown.push(ingredient);
      }
    }

    return categorized;
  }

  /**
   * Calculate store score based on ingredient categories
   */
  calculateStoreScore(store, categorized) {
    let score = 0;
    const storeInfo = store.storeChainInfo;

    // Base score from store type
    if (storeInfo) {
      score += storeInfo.veganFriendly * 5;
    } else {
      score += 35; // Unknown stores get moderate score
    }

    // Specialty vegan ingredients
    if (categorized.specialty_vegan.length > 0) {
      if (store.type === 'organic-store' || store.hasVeganSection) {
        score += 40;
      } else if (store.type === 'supermarket' && storeInfo?.veganFriendly >= 7) {
        score += 20;
      } else {
        score += 5;
      }
    }

    // Organic preferred ingredients
    if (categorized.organic_preferred.length > 0) {
      if (store.type === 'organic-store') {
        score += 30;
      } else if (store.type === 'supermarket') {
        score += 10;
      }
    }

    // Fresh produce
    if (categorized.fresh_produce.length > 0) {
      if (store.type === 'farmers-market') {
        score += 35;
      } else if (store.type === 'organic-store') {
        score += 25;
      } else {
        score += 15;
      }
    }

    // Common ingredients (all stores should have)
    if (categorized.common.length > 0) {
      score += 10;
    }

    // Distance penalty (closer is better)
    const distanceKm = store.distance / 1000;
    score -= distanceKm * 3;

    // Bonus for known good chains
    if (storeInfo?.specialty) {
      score += 15;
    }

    return Math.max(0, Math.round(score));
  }

  /**
   * Estimate ingredient coverage percentage
   */
  estimateCoverage(store, categorized) {
    const totalIngredients = 
      categorized.common.length +
      categorized.specialty_vegan.length +
      categorized.organic_preferred.length +
      categorized.fresh_produce.length +
      categorized.grains_legumes.length +
      categorized.spices.length +
      categorized.unknown.length;

    if (totalIngredients === 0) return 0;

    let coveredIngredients = 0;
    const storeInfo = store.storeChainInfo;

    // Common ingredients - almost all stores have these
    coveredIngredients += categorized.common.length * 0.95;

    // Specialty vegan - only specialty stores have good selection
    if (store.type === 'organic-store' || store.hasVeganSection) {
      coveredIngredients += categorized.specialty_vegan.length * 0.9;
    } else if (storeInfo?.veganFriendly >= 7) {
      coveredIngredients += categorized.specialty_vegan.length * 0.5;
    } else {
      coveredIngredients += categorized.specialty_vegan.length * 0.2;
    }

    // Organic preferred
    if (store.type === 'organic-store') {
      coveredIngredients += categorized.organic_preferred.length * 0.95;
    } else {
      coveredIngredients += categorized.organic_preferred.length * 0.6;
    }

    // Fresh produce
    if (store.type === 'farmers-market') {
      coveredIngredients += categorized.fresh_produce.length * 1.0;
    } else if (store.type === 'organic-store') {
      coveredIngredients += categorized.fresh_produce.length * 0.9;
    } else {
      coveredIngredients += categorized.fresh_produce.length * 0.8;
    }

    // Grains and legumes - most stores have these
    coveredIngredients += categorized.grains_legumes.length * 0.85;

    // Spices - most stores have common spices
    coveredIngredients += categorized.spices.length * 0.8;

    // Unknown - assume 50% coverage
    coveredIngredients += categorized.unknown.length * 0.5;

    return Math.min(100, Math.round((coveredIngredients / totalIngredients) * 100));
  }

  /**
   * Generate human-readable recommendation reason
   */
  generateRecommendationReason(store, categorized) {
    const reasons = [];
    const storeInfo = store.storeChainInfo;

    if (categorized.specialty_vegan.length > 0) {
      if (store.type === 'organic-store' || store.hasVeganSection) {
        reasons.push(`Excellent selection of specialty vegan ingredients`);
      } else if (storeInfo?.veganFriendly >= 7) {
        reasons.push(`Good vegan options available`);
      }
    }

    if (categorized.organic_preferred.length > 0 && store.type === 'organic-store') {
      reasons.push(`Specializes in organic products`);
    }

    if (categorized.fresh_produce.length > 0 && store.type === 'farmers-market') {
      reasons.push(`Fresh, local produce`);
    }

    if (store.distance < 1000) {
      reasons.push(`Very close to you (${Math.round(store.distance)}m)`);
    } else if (store.distance < 2000) {
      reasons.push(`Nearby (${(store.distance / 1000).toFixed(1)}km)`);
    }

    if (storeInfo?.chain) {
      const chainName = storeInfo.chain.charAt(0).toUpperCase() + storeInfo.chain.slice(1);
      reasons.push(`Trusted ${chainName} store`);
    }

    if (reasons.length === 0) {
      reasons.push(`Good general selection`);
    }

    return reasons.join(' • ');
  }

  /**
   * Enhance recommendations with AI for specialty ingredients
   */
  async enhanceWithAI(stores, specialtyIngredients) {
    try {
      // Only enhance top 3 stores to save API calls
      const topStores = stores.slice(0, 3);
      
      for (const store of topStores) {
        const aiInsight = await this.getAIInsight(store, specialtyIngredients);
        if (aiInsight) {
          store.aiRecommendation = aiInsight;
        }
      }
    } catch (error) {
      console.error('Error enhancing with AI:', error);
      // Continue without AI enhancement
    }
  }

  /**
   * Get AI insight for specific store and ingredients
   */
  async getAIInsight(store, ingredients) {
    try {
      const ingredientList = ingredients.map(ing => ing.name || ing).join(', ');
      const storeType = store.type;
      const storeName = store.name;

      const prompt = `As a vegan shopping expert, briefly assess if "${storeName}" (a ${storeType}) in France is likely to have these specialty vegan ingredients: ${ingredientList}. Answer in 1-2 sentences with likelihood (high/medium/low) and why.`;

      const response = await axios.post(
        process.env.BLACKBOX_API_URL || 'https://api.blackbox.ai/chat/completions',
        {
          model: 'blackboxai/anthropic/claude-sonnet-4.5',
          messages: [
            {
              role: 'system',
              content: 'You are a vegan shopping expert in France. Provide brief, helpful assessments.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 150,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.BLACKBOX_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI insight error:', error.message);
      return null;
    }
  }

  /**
   * Get missing ingredients that might not be available
   */
  identifyMissingIngredients(store, ingredients) {
    const categorized = this.categorizeIngredients(ingredients);
    const missing = [];

    // Specialty vegan items might be missing from regular stores
    if (store.type !== 'organic-store' && !store.hasVeganSection) {
      missing.push(...categorized.specialty_vegan);
    }

    return missing;
  }
}

module.exports = new IngredientMatchingService();
