const axios = require('axios');

class OSMStoreService {
  constructor() {
    this.overpassUrl = 'https://overpass-api.de/api/interpreter';
    
    // French store chains and their characteristics
    this.storeChains = {
      // Major supermarkets - wide selection
      'carrefour': { type: 'supermarket', veganFriendly: 8, specialty: false },
      'auchan': { type: 'supermarket', veganFriendly: 8, specialty: false },
      'leclerc': { type: 'supermarket', veganFriendly: 8, specialty: false },
      'intermarché': { type: 'supermarket', veganFriendly: 7, specialty: false },
      'casino': { type: 'supermarket', veganFriendly: 7, specialty: false },
      'monoprix': { type: 'supermarket', veganFriendly: 8, specialty: false },
      'franprix': { type: 'supermarket', veganFriendly: 7, specialty: false },
      
      // Organic/specialty stores - best for vegan
      'biocoop': { type: 'organic-store', veganFriendly: 10, specialty: true },
      'naturalia': { type: 'organic-store', veganFriendly: 10, specialty: true },
      'la vie claire': { type: 'organic-store', veganFriendly: 10, specialty: true },
      "bio c' bon": { type: 'organic-store', veganFriendly: 10, specialty: true },
      'bio': { type: 'organic-store', veganFriendly: 9, specialty: true },
      
      // Discount stores - basic selection
      'lidl': { type: 'supermarket', veganFriendly: 6, specialty: false },
      'aldi': { type: 'supermarket', veganFriendly: 6, specialty: false },
      
      // Markets
      'marché': { type: 'farmers-market', veganFriendly: 9, specialty: true },
      'market': { type: 'farmers-market', veganFriendly: 9, specialty: true }
    };
  }

  /**
   * Find stores near a location using OpenStreetMap
   */
  async findNearbyStores(latitude, longitude, radiusMeters = 5000) {
    try {
      const query = this.buildOverpassQuery(latitude, longitude, radiusMeters);
      
      const response = await axios.post(
        this.overpassUrl,
        query,
        {
          headers: { 'Content-Type': 'text/plain' },
          timeout: 30000 // Increased timeout to 30 seconds
        }
      );

      const stores = this.parseOverpassResponse(response.data, latitude, longitude);
      return stores;
    } catch (error) {
      console.error('OSM API Error:', error.response?.status, error.message);
      
      // If OSM fails, return empty array instead of throwing
      // This allows the app to continue working
      console.log('Returning empty store list due to OSM API error');
      return [];
    }
  }

  /**
   * Build Overpass API query for stores (simplified for better performance)
   */
  buildOverpassQuery(lat, lon, radius) {
    // Simplified query - only nodes, not ways, for faster response
    return `
      [out:json][timeout:25];
      (
        node["shop"="supermarket"](around:${radius},${lat},${lon});
        node["shop"="organic"](around:${radius},${lat},${lon});
        node["shop"="convenience"](around:${radius},${lat},${lon});
        node["shop"="health_food"](around:${radius},${lat},${lon});
      );
      out body;
    `;
  }

  /**
   * Parse Overpass API response
   */
  parseOverpassResponse(data, userLat, userLon) {
    const stores = [];
    const elements = data.elements || [];

    for (const element of elements) {
      if (!element.tags || !element.tags.name) continue;

      const lat = element.lat || element.center?.lat;
      const lon = element.lon || element.center?.lon;
      
      if (!lat || !lon) continue;

      const store = {
        osmId: element.id,
        name: element.tags.name,
        type: this.mapOSMShopType(element.tags.shop || element.tags.amenity),
        location: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        address: this.buildAddress(element.tags),
        contact: {
          phone: element.tags.phone || element.tags['contact:phone'],
          website: element.tags.website || element.tags['contact:website']
        },
        openingHours: element.tags.opening_hours,
        distance: this.calculateDistance(userLat, userLon, lat, lon),
        source: 'openstreetmap',
        hasVeganSection: this.detectVeganSection(element.tags),
        storeChainInfo: this.identifyStoreChain(element.tags.name)
      };

      stores.push(store);
    }

    // Sort by distance
    stores.sort((a, b) => a.distance - b.distance);

    return stores;
  }

  /**
   * Map OSM shop types to our types
   */
  mapOSMShopType(osmType) {
    const typeMap = {
      'supermarket': 'supermarket',
      'organic': 'organic-store',
      'health_food': 'organic-store',
      'convenience': 'supermarket',
      'greengrocer': 'specialty-store',
      'marketplace': 'farmers-market'
    };
    return typeMap[osmType] || 'supermarket';
  }

  /**
   * Build address from OSM tags
   */
  buildAddress(tags) {
    return {
      street: tags['addr:street'] || tags.street,
      city: tags['addr:city'] || tags.city,
      zipCode: tags['addr:postcode'] || tags.postcode,
      country: tags['addr:country'] || 'France'
    };
  }

  /**
   * Detect if store has vegan section
   */
  detectVeganSection(tags) {
    const name = (tags.name || '').toLowerCase();
    const description = (tags.description || '').toLowerCase();
    
    // Organic stores usually have good vegan sections
    if (tags.shop === 'organic' || tags.shop === 'health_food') {
      return true;
    }
    
    // Check for vegan keywords
    const veganKeywords = ['bio', 'organic', 'vegan', 'végé', 'naturel'];
    return veganKeywords.some(keyword => 
      name.includes(keyword) || description.includes(keyword)
    );
  }

  /**
   * Identify store chain and get characteristics
   */
  identifyStoreChain(storeName) {
    if (!storeName) return null;
    
    const nameLower = storeName.toLowerCase();
    
    for (const [chain, info] of Object.entries(this.storeChains)) {
      if (nameLower.includes(chain)) {
        return {
          chain: chain,
          ...info
        };
      }
    }
    
    return null;
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // Distance in meters
  }

  /**
   * Score stores based on ingredient availability likelihood
   */
  scoreStoreForIngredients(store, ingredients) {
    let score = 0;
    const storeInfo = store.storeChainInfo;
    
    // Base score from store type
    if (storeInfo) {
      score += storeInfo.veganFriendly * 10;
      if (storeInfo.specialty) score += 20;
    } else {
      // Unknown store, give moderate score
      score += 50;
    }
    
    // Bonus for organic/vegan section
    if (store.hasVeganSection) {
      score += 30;
    }
    
    // Penalty for distance (further = lower score)
    const distanceKm = store.distance / 1000;
    score -= distanceKm * 2;
    
    // Analyze ingredients for specialty items
    const specialtyIngredients = this.identifySpecialtyIngredients(ingredients);
    if (specialtyIngredients.length > 0 && storeInfo?.specialty) {
      score += 20;
    }
    
    return Math.max(0, Math.round(score));
  }

  /**
   * Identify specialty/hard-to-find ingredients
   */
  identifySpecialtyIngredients(ingredients) {
    const specialtyKeywords = [
      'nutritional yeast', 'tempeh', 'seitan', 'tahini',
      'miso', 'tamari', 'aquafaba', 'jackfruit',
      'vegan cheese', 'vegan butter', 'plant milk',
      'chia seeds', 'flax seeds', 'hemp seeds'
    ];
    
    return ingredients.filter(ing => {
      const name = (ing.name || ing).toLowerCase();
      return specialtyKeywords.some(keyword => name.includes(keyword));
    });
  }

  /**
   * Calculate ingredient coverage for a store
   */
  calculateIngredientCoverage(store, ingredients) {
    const storeInfo = store.storeChainInfo;
    
    if (!storeInfo) {
      // Unknown store, assume 70% coverage
      return 70;
    }
    
    const specialtyIngredients = this.identifySpecialtyIngredients(ingredients);
    const commonIngredients = ingredients.length - specialtyIngredients.length;
    
    let coverage = 0;
    
    // Common ingredients (most stores have these)
    coverage += (commonIngredients / ingredients.length) * 100;
    
    // Specialty ingredients (only specialty stores have these)
    if (specialtyIngredients.length > 0) {
      const specialtyCoverage = storeInfo.specialty ? 100 : 30;
      coverage += (specialtyIngredients.length / ingredients.length) * specialtyCoverage;
    }
    
    // Adjust based on vegan friendliness
    coverage = coverage * (storeInfo.veganFriendly / 10);
    
    return Math.min(100, Math.round(coverage));
  }
}

module.exports = new OSMStoreService();
