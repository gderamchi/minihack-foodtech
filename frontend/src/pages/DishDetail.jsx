import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLeaf, FaClock, FaUsers, FaStar, FaArrowLeft } from 'react-icons/fa';
import { dishesAPI } from '../services/api';

function DishDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDish();
  }, [id]);

  const fetchDish = async () => {
    try {
      setLoading(true);
      const response = await dishesAPI.getById(id);
      setDish(response.data);
    } catch (error) {
      console.error('Error fetching dish:', error);
      toast.error('Failed to load dish details');
    } finally {
      setLoading(false);
    }
  };

  const handleFindStores = () => {
    navigate('/stores', { state: { dish } });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading dish details...</p>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Dish not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-primary-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
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
            <FaLeaf className="text-2xl" />
            <span className="font-semibold">
              {dish.isVegan ? 'Vegan' : 'Non-Vegan'}
            </span>
            {dish.generatedByAI && (
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                AI Generated
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">{dish.name}</h1>
          <p className="text-primary-100 text-lg">{dish.description}</p>
          
          <div className="flex items-center space-x-6 mt-6">
            <div className="flex items-center space-x-2">
              <FaClock />
              <span>{(dish.prepTime || 0) + (dish.cookTime || 0)} min</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaUsers />
              <span>{dish.servings} servings</span>
            </div>
            {dish.averageRating > 0 && (
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-300" />
                <span>{dish.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-8">
          {/* Times */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-primary-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Prep Time</div>
              <div className="text-2xl font-bold text-primary-600">
                {dish.prepTime || 0} min
              </div>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Cook Time</div>
              <div className="text-2xl font-bold text-primary-600">
                {dish.cookTime || 0} min
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <ul className="space-y-3">
                {dish.ingredients.map((ing, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-primary-600 mt-1 text-xl">•</span>
                    <span className="text-gray-700 text-lg">
                      {ing.quantity && <strong>{ing.quantity}</strong>} {ing.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
            <ol className="space-y-4">
              {dish.instructions.map((instruction, index) => (
                <li key={index} className="flex space-x-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 pt-2 text-lg">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Nutritional Info */}
          {dish.nutritionalInfo && Object.keys(dish.nutritionalInfo).length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Nutritional Information (per serving)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dish.nutritionalInfo.calories && (
                  <div className="bg-primary-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {dish.nutritionalInfo.calories}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Calories</div>
                  </div>
                )}
                {dish.nutritionalInfo.protein && (
                  <div className="bg-primary-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {dish.nutritionalInfo.protein}g
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Protein</div>
                  </div>
                )}
                {dish.nutritionalInfo.carbs && (
                  <div className="bg-primary-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {dish.nutritionalInfo.carbs}g
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Carbs</div>
                  </div>
                )}
                {dish.nutritionalInfo.fat && (
                  <div className="bg-primary-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {dish.nutritionalInfo.fat}g
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Fat</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {dish.tags && dish.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {dish.tags.map((tag, index) => (
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

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={handleFindStores}
              className="flex-1 bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition text-lg"
            >
              Find Ingredients at Nearby Stores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DishDetail;
