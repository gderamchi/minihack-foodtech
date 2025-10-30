const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dishId, longitude, latitude, maxDistance = 10000 } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Longitude and latitude are required' });
    }

    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const radius = parseInt(maxDistance);

    // For now, we'll fetch nearby stores and assume they have the ingredients
    // In a full implementation, you'd match ingredients with store inventory
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["shop"="supermarket"](around:${radius},${lat},${lon});
        node["shop"="organic"](around:${radius},${lat},${lon});
        node["shop"="health_food"](around:${radius},${lat},${lon});
        node["shop"="greengrocer"](around:${radius},${lat},${lon});
        way["shop"="supermarket"](around:${radius},${lat},${lon});
        way["shop"="organic"](around:${radius},${lat},${lon});
        way["shop"="health_food"](around:${radius},${lat},${lon});
      );
      out center;
    `;

    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const response = await axios.post(overpassUrl, overpassQuery, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 30000
    });

    const elements = response.data.elements || [];

    // Transform OSM data to our store format with coverage percentage
    const stores = elements.map(element => {
      const tags = element.tags || {};
      const coords = element.center || { lat: element.lat, lon: element.lon };
      
      const distance = calculateDistance(lat, lon, coords.lat, coords.lon);
      
      let storeType = 'supermarket';
      let coveragePercentage = 70; // Default coverage
      
      if (tags.shop === 'organic' || tags.organic === 'yes') {
        storeType = 'organic-store';
        coveragePercentage = 95; // Organic stores likely have more vegan ingredients
      } else if (tags.shop === 'health_food') {
        storeType = 'specialty-store';
        coveragePercentage = 90;
      } else if (tags.shop === 'greengrocer') {
        storeType = 'farmers-market';
        coveragePercentage = 60; // Mainly produce
      }

      return {
        _id: `osm-${element.id}`,
        name: tags.name || tags['name:en'] || `${storeType.replace('-', ' ')} Store`,
        type: storeType,
        location: {
          type: 'Point',
          coordinates: [coords.lon, coords.lat]
        },
        address: {
          street: tags['addr:street'] || '',
          city: tags['addr:city'] || '',
          zipCode: tags['addr:postcode'] || '',
          country: tags['addr:country'] || ''
        },
        contact: {
          phone: tags.phone || tags['contact:phone'] || '',
          website: tags.website || tags['contact:website'] || ''
        },
        hasVeganSection: tags.organic === 'yes' || tags.diet_vegan === 'yes' || storeType === 'organic-store',
        distance: distance,
        coveragePercentage: coveragePercentage,
        averageRating: 0,
        source: 'openstreetmap'
      };
    });

    // Sort by coverage percentage and distance
    stores.sort((a, b) => {
      if (Math.abs(a.coveragePercentage - b.coveragePercentage) > 10) {
        return b.coveragePercentage - a.coveragePercentage;
      }
      return a.distance - b.distance;
    });

    return res.status(200).json({
      success: true,
      stores: stores.slice(0, 20), // Limit to top 20 stores
      message: stores.length > 0 ? 'Found stores with ingredients' : 'No stores found nearby'
    });

  } catch (error) {
    console.error('Error fetching store recommendations:', error.message);
    return res.status(500).json({
      error: 'Failed to fetch store recommendations',
      message: error.message
    });
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
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
