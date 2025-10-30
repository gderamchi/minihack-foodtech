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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { longitude, latitude, maxDistance = 10000, limit = 50, page = 1 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Longitude and latitude are required' });
    }

    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const radius = parseInt(maxDistance);
    const pageSize = parseInt(limit);
    const pageNum = parseInt(page);

    // OpenStreetMap Overpass API query for vegan-friendly stores
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["shop"="supermarket"](around:${radius},${lat},${lon});
        node["shop"="organic"](around:${radius},${lat},${lon});
        node["shop"="health_food"](around:${radius},${lat},${lon});
        node["shop"="greengrocer"](around:${radius},${lat},${lon});
        node["shop"="farm"](around:${radius},${lat},${lon});
        node["amenity"="marketplace"](around:${radius},${lat},${lon});
        way["shop"="supermarket"](around:${radius},${lat},${lon});
        way["shop"="organic"](around:${radius},${lat},${lon});
        way["shop"="health_food"](around:${radius},${lat},${lon});
        way["shop"="greengrocer"](around:${radius},${lat},${lon});
      );
      out center;
    `;

    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const response = await axios.post(overpassUrl, overpassQuery, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 30000
    });

    const elements = response.data.elements || [];

    // Transform OSM data to our store format
    const stores = elements.map(element => {
      const tags = element.tags || {};
      const coords = element.center || { lat: element.lat, lon: element.lon };
      
      // Calculate distance
      const distance = calculateDistance(lat, lon, coords.lat, coords.lon);
      
      // Determine store type
      let storeType = 'supermarket';
      if (tags.shop === 'organic' || tags.organic === 'yes') {
        storeType = 'organic-store';
      } else if (tags.shop === 'health_food') {
        storeType = 'specialty-store';
      } else if (tags.shop === 'greengrocer' || tags.shop === 'farm') {
        storeType = 'farmers-market';
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
          website: tags.website || tags['contact:website'] || '',
          email: tags.email || tags['contact:email'] || ''
        },
        openingHours: tags.opening_hours ? parseOpeningHours(tags.opening_hours) : [],
        hasVeganSection: tags.organic === 'yes' || tags.diet_vegan === 'yes' || storeType === 'organic-store',
        distance: distance,
        averageRating: 0,
        isVerified: false,
        source: 'openstreetmap'
      };
    });

    // Sort by distance
    stores.sort((a, b) => a.distance - b.distance);

    // Apply pagination
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedStores = stores.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      stores: paginatedStores,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: stores.length,
        hasMore: endIndex < stores.length
      }
    });

  } catch (error) {
    console.error('Error fetching nearby stores:', error.message);
    return res.status(500).json({
      error: 'Failed to fetch nearby stores',
      message: error.message
    });
  }
};

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Parse opening hours (simplified)
function parseOpeningHours(hoursString) {
  // This is a simplified parser - OSM opening hours can be complex
  // For now, just return an empty array
  return [];
}
