import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { toast } from 'react-toastify';
import { FaStore, FaMapMarkerAlt, FaPhone, FaGlobe, FaStar } from 'react-icons/fa';
import { storesAPI } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function StoreLocator() {
  const location = useLocation();
  const dishFromState = location.state?.dish;

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);

  // Default to Paris coordinates
  const defaultLocation = { latitude: 48.8566, longitude: 2.3522 };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      if (dishFromState) {
        fetchStoresForDish();
      } else {
        fetchNearbyStores();
      }
    }
  }, [userLocation, dishFromState]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.info('Using default location (Paris)');
          setUserLocation(defaultLocation);
        }
      );
    } else {
      toast.info('Geolocation not supported, using default location');
      setUserLocation(defaultLocation);
    }
  };

  const fetchNearbyStores = async () => {
    try {
      setLoading(true);
      const response = await storesAPI.findNearby({
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
        maxDistance: 10000 // 10km
      });
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to load nearby stores');
    } finally {
      setLoading(false);
    }
  };

  const fetchStoresForDish = async () => {
    try {
      setLoading(true);
      const response = await storesAPI.getRecommendationsForDish({
        dishId: dishFromState._id,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude
      });
      setStores(response.data.stores);
      if (response.data.stores.length === 0) {
        toast.info('No stores found with these ingredients nearby');
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to load store recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (!userLocation) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Getting your location...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <FaStore className="text-5xl text-primary-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {dishFromState ? 'Stores for Your Dish' : 'Find Vegan Stores'}
        </h1>
        <p className="text-xl text-gray-600">
          {dishFromState
            ? `Find ingredients for ${dishFromState.name}`
            : 'Discover vegan-friendly stores near you'}
        </p>
      </div>

      {dishFromState && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-primary-900 mb-2">
            Looking for ingredients for: {dishFromState.name}
          </h3>
          <p className="text-sm text-primary-700">
            Showing stores that carry the ingredients you need
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="bg-white rounded-xl shadow-lg p-4 h-[600px]">
          <MapContainer
            center={[userLocation.latitude, userLocation.longitude]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* User location marker */}
            <Marker position={[userLocation.latitude, userLocation.longitude]}>
              <Popup>Your Location</Popup>
            </Marker>

            {/* Store markers */}
            {stores.map((store) => (
              <Marker
                key={store._id}
                position={[
                  store.location.coordinates[1],
                  store.location.coordinates[0]
                ]}
                eventHandlers={{
                  click: () => setSelectedStore(store)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">{store.name}</h3>
                    <p className="text-sm text-gray-600">{store.type}</p>
                    {store.coveragePercentage && (
                      <p className="text-sm text-primary-600 font-semibold mt-1">
                        {store.coveragePercentage.toFixed(0)}% ingredients available
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Store List */}
        <div className="space-y-4 h-[600px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading stores...</p>
            </div>
          ) : stores.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <FaStore className="text-5xl text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No stores found nearby</p>
            </div>
          ) : (
            stores.map((store) => (
              <div
                key={store._id}
                onClick={() => setSelectedStore(store)}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition ${
                  selectedStore?._id === store._id
                    ? 'ring-2 ring-primary-500'
                    : 'hover:shadow-xl'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {store.name}
                    </h3>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                      {store.type}
                    </span>
                  </div>
                  {store.averageRating > 0 && (
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <FaStar />
                      <span className="text-sm font-semibold text-gray-700">
                        {store.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {store.coveragePercentage && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Ingredient Coverage</span>
                      <span className="font-semibold text-primary-600">
                        {store.coveragePercentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${store.coveragePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm text-gray-600">
                  {store.address && (
                    <div className="flex items-start space-x-2">
                      <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                      <span>
                        {store.address.street}, {store.address.city} {store.address.zipCode}
                      </span>
                    </div>
                  )}
                  {store.contact?.phone && (
                    <div className="flex items-center space-x-2">
                      <FaPhone />
                      <span>{store.contact.phone}</span>
                    </div>
                  )}
                  {store.contact?.website && (
                    <div className="flex items-center space-x-2">
                      <FaGlobe />
                      <a
                        href={store.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                {store.hasVeganSection && (
                  <div className="mt-3 inline-flex items-center space-x-1 text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    <span>🌱</span>
                    <span>Has Vegan Section</span>
                  </div>
                )}

                {store.distance && (
                  <div className="mt-3 text-sm text-gray-500">
                    📍 {(store.distance / 1000).toFixed(1)} km away
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StoreLocator;
