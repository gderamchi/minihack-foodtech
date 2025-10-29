import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBook, FaStar, FaClock, FaUsers, FaArrowLeft, FaUtensils } from 'react-icons/fa';
import { menusAPI } from '../services/api';

function MenuDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, [id]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await menusAPI.getById(id);
      setMenu(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Failed to load menu details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading menu details...</p>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Menu not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-primary-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const groupedDishes = menu.dishes.reduce((acc, item) => {
    const category = item.category || 'main';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition"
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-8 text-white">
          <div className="flex items-center space-x-2 mb-4">
            <FaBook className="text-2xl" />
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
              {menu.type}
            </span>
            {menu.isVegan && (
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                100% Vegan
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">{menu.name}</h1>
          <p className="text-primary-100 text-lg mb-6">{menu.description}</p>
          
          <div className="flex items-center space-x-6">
            {menu.cuisine && (
              <div className="flex items-center space-x-2">
                <span>🍽️</span>
                <span>{menu.cuisine}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <FaUtensils />
              <span className="capitalize">{menu.occasion}</span>
            </div>
            {menu.averageRating > 0 && (
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-300" />
                <span>{menu.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-8">
          {/* Menu Stats */}
          {(menu.totalPrepTime || menu.totalCookTime || menu.servings) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {menu.totalPrepTime && (
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-1">Total Prep Time</div>
                  <div className="text-2xl font-bold text-primary-600">
                    {menu.totalPrepTime} min
                  </div>
                </div>
              )}
              {menu.totalCookTime && (
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-1">Total Cook Time</div>
                  <div className="text-2xl font-bold text-primary-600">
                    {menu.totalCookTime} min
                  </div>
                </div>
              )}
              {menu.servings && (
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-1">Servings</div>
                  <div className="text-2xl font-bold text-primary-600">
                    {menu.servings}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dishes by Category */}
          <div className="space-y-8">
            {Object.entries(groupedDishes).map(([category, dishes]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 capitalize">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dishes.map((item, index) => (
                    <Link
                      key={index}
                      to={`/dishes/${item.dish._id}`}
                      className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition">
                          {item.dish.name}
                        </h3>
                        {item.dish.isVegan && (
                          <span className="text-primary-600 text-xl">🌱</span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.dish.description}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {item.dish.prepTime && item.dish.cookTime && (
                          <div className="flex items-center space-x-1">
                            <FaClock />
                            <span>{item.dish.prepTime + item.dish.cookTime} min</span>
                          </div>
                        )}
                        {item.dish.servings && (
                          <div className="flex items-center space-x-1">
                            <FaUsers />
                            <span>{item.dish.servings} servings</span>
                          </div>
                        )}
                        {item.dish.difficulty && (
                          <span className="px-2 py-1 bg-gray-200 rounded text-xs capitalize">
                            {item.dish.difficulty}
                          </span>
                        )}
                      </div>

                      {item.dish.ingredients && item.dish.ingredients.length > 0 && (
                        <div className="mt-3 text-xs text-gray-500">
                          {item.dish.ingredients.length} ingredients
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          {menu.tags && menu.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {menu.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Source Info */}
          {menu.source && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                <strong>Source:</strong> {menu.source}
                {menu.sourceUrl && (
                  <>
                    {' - '}
                    <a
                      href={menu.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      View Original
                    </a>
                  </>
                )}
              </div>
              {menu.createdBy && (
                <div className="text-sm text-gray-600 mt-1">
                  <strong>Created by:</strong> {menu.createdBy.name}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuDetail;
