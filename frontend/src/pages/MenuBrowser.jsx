import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBook, FaSearch, FaStar, FaClock, FaUsers } from 'react-icons/fa';
import { menusAPI } from '../services/api';

function MenuBrowser() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    cuisine: '',
    occasion: ''
  });

  useEffect(() => {
    fetchMenus();
  }, [filters]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await menusAPI.getAll(filters);
      setMenus(response.data.menus);
    } catch (error) {
      console.error('Error fetching menus:', error);
      toast.error('Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredMenus = menus.filter(menu =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <FaBook className="text-5xl text-primary-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Browse Vegan Menus
        </h1>
        <p className="text-xl text-gray-600">
          Discover curated vegan menus from our community and experts
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search menus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="base">Base Menus</option>
            <option value="community">Community</option>
            <option value="referenced">Referenced</option>
          </select>

          <select
            name="occasion"
            value={filters.occasion}
            onChange={handleFilterChange}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Occasions</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
            <option value="special-occasion">Special Occasion</option>
          </select>
        </div>
      </div>

      {/* Menus Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading menus...</p>
        </div>
      ) : filteredMenus.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <FaBook className="text-5xl text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">No menus found</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenus.map((menu) => (
            <Link
              key={menu._id}
              to={`/menus/${menu._id}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
            >
              <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <FaBook className="text-6xl text-white opacity-50 group-hover:opacity-75 transition" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                    {menu.type}
                  </span>
                  {menu.averageRating > 0 && (
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <FaStar />
                      <span className="text-sm font-semibold text-gray-700">
                        {menu.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                  {menu.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {menu.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="capitalize">{menu.occasion}</span>
                  <span>{menu.dishes.length} dishes</span>
                </div>
                {menu.cuisine && (
                  <div className="mt-2 text-xs text-gray-500">
                    🍽️ {menu.cuisine}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuBrowser;
