import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUtensils, FaSpinner, FaLeaf, FaClock, FaUsers } from 'react-icons/fa';
import { dishesAPI } from '../services/api';

function DishInput() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dishName: '',
    description: '',
    ingredients: '',
    cuisine: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.dishName.trim()) {
      toast.error('Please enter a dish name');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const ingredientsArray = formData.ingredients
        .split(',')
        .map(ing => ing.trim())
        .filter(ing => ing)
        .map(ing => ({ name: ing }));

      const response = await dishesAPI.generateVeganAlternative({
        name: formData.dishName, // Changed from dishName to name
        description: formData.description,
        ingredients: ingredientsArray,
        cuisine: formData.cuisine
      });

      setResult(response.data);
      toast.success('Vegan alternative generated successfully!');
    } catch (error) {
      console.error('Error generating vegan alternative:', error);
      toast.error(error.response?.data?.error || 'Failed to generate vegan alternative');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStores = () => {
    if (result && result.veganDish) {
      navigate('/stores', { state: { dish: result.veganDish } });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <FaUtensils className="text-5xl text-primary-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Vegan Alternative
        </h1>
        <p className="text-xl text-gray-600">
          Enter any dish and we'll find or create a delicious vegan version for you!
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dish Name *
            </label>
            <input
              type="text"
              name="dishName"
              value={formData.dishName}
              onChange={handleChange}
              placeholder="e.g., Chicken Parmesan, Beef Tacos, Salmon Sushi"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the dish, its flavors, or any special characteristics..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ingredients (Optional)
            </label>
            <input
              type="text"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="e.g., chicken, cheese, tomato sauce (comma-separated)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate ingredients with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cuisine Type (Optional)
            </label>
            <input
              type="text"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              placeholder="e.g., Italian, Mexican, Japanese"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Generating Vegan Alternative...</span>
              </>
            ) : (
              <>
                <FaLeaf />
                <span>Get Vegan Alternative</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Display */}
      {result && result.veganDish && (
        <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 text-sm text-primary-600 mb-2">
                <FaLeaf />
                <span className="font-semibold">
                  {result.veganDish.source === 'database' ? 'From Our Database' : 'AI Generated'}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                {result.veganDish.name}
              </h2>
            </div>
            <div className="flex space-x-2">
              <div className="flex items-center space-x-1 text-gray-600">
                <FaClock />
                <span>{result.veganDish.prepTime + result.veganDish.cookTime} min</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <FaUsers />
                <span>{result.veganDish.servings} servings</span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{result.veganDish.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h3>
              <ul className="space-y-2">
                {result.veganDish.ingredients.map((ing, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span className="text-gray-700">
                      {ing.quantity && `${ing.quantity} `}
                      {ing.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nutritional Info */}
            {result.veganDish.nutritionalInfo && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Nutritional Info (per serving)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {result.veganDish.nutritionalInfo.calories && (
                    <div className="bg-primary-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">
                        {result.veganDish.nutritionalInfo.calories}
                      </div>
                      <div className="text-sm text-gray-600">Calories</div>
                    </div>
                  )}
                  {result.veganDish.nutritionalInfo.protein && (
                    <div className="bg-primary-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">
                        {result.veganDish.nutritionalInfo.protein}g
                      </div>
                      <div className="text-sm text-gray-600">Protein</div>
                    </div>
                  )}
                  {result.veganDish.nutritionalInfo.carbs && (
                    <div className="bg-primary-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">
                        {result.veganDish.nutritionalInfo.carbs}g
                      </div>
                      <div className="text-sm text-gray-600">Carbs</div>
                    </div>
                  )}
                  {result.veganDish.nutritionalInfo.fat && (
                    <div className="bg-primary-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">
                        {result.veganDish.nutritionalInfo.fat}g
                      </div>
                      <div className="text-sm text-gray-600">Fat</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Instructions</h3>
            <ol className="space-y-3">
              {result.veganDish.instructions.map((instruction, index) => (
                <li key={index} className="flex space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 pt-1">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          {result.veganDish.tips && (
            <div className="bg-primary-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">💡 Tips</h4>
              <p className="text-gray-700">{result.veganDish.tips}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleViewStores}
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Find Ingredients at Nearby Stores
            </button>
            <button
              onClick={() => {
                setFormData({
                  dishName: '',
                  description: '',
                  ingredients: '',
                  cuisine: ''
                });
                setResult(null);
              }}
              className="flex-1 bg-white text-primary-600 border-2 border-primary-600 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Try Another Dish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DishInput;
