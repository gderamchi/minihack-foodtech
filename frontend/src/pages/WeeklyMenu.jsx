import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { weeklyMenuAPI } from '../services/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, FaUtensils, FaClock, FaFire, FaExchangeAlt, 
  FaShoppingCart, FaSync, FaChartPie, FaLeaf 
} from 'react-icons/fa';
import EnhancedLoading from '../components/EnhancedLoading';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function WeeklyMenu() {
  const { currentUser } = useAuth();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [swapping, setSwapping] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [shoppingList, setShoppingList] = useState(null);
  const [showShoppingList, setShowShoppingList] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadCurrentMenu();
    }
  }, [currentUser]);

  const loadCurrentMenu = async () => {
    try {
      setLoading(true);
      const response = await weeklyMenuAPI.getCurrent(currentUser.uid);
      
      if (response.data.hasMenu) {
        setMenu(response.data.menu);
      } else {
        setMenu(null);
      }
    } catch (error) {
      console.error('Error loading menu:', error);
      if (error.response?.status === 404) {
        setMenu(null);
      } else {
        toast.error('Failed to load menu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMenu = async () => {
    try {
      setGenerating(true);
      toast.info('Generating your personalized weekly menu... This may take a minute!');
      
      const response = await weeklyMenuAPI.generate(currentUser.uid);
      setMenu(response.data.menu);
      toast.success('Weekly menu generated successfully! 🎉');
    } catch (error) {
      console.error('Error generating menu:', error);
      toast.error(error.response?.data?.error || 'Failed to generate menu');
    } finally {
      setGenerating(false);
    }
  };

  const handleSwapMeal = async (dayIndex, mealIndex) => {
    try {
      setSwapping(`${dayIndex}-${mealIndex}`);
      toast.info('Finding a new meal for you...');
      
      const response = await weeklyMenuAPI.swapMeal(
        menu._id,
        dayIndex,
        mealIndex,
        currentUser.uid
      );
      
      setMenu(response.data.menu);
      toast.success('Meal swapped successfully!');
    } catch (error) {
      console.error('Error swapping meal:', error);
      toast.error('Failed to swap meal');
    } finally {
      setSwapping(null);
    }
  };

  const handleGenerateShoppingList = async () => {
    try {
      setLoading(true);
      const response = await weeklyMenuAPI.getShoppingList(menu._id, currentUser.uid);
      setShoppingList(response.data.shoppingList);
      setShowShoppingList(true);
      toast.success('Shopping list generated!');
    } catch (error) {
      console.error('Error generating shopping list:', error);
      toast.error('Failed to generate shopping list');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !menu) {
    return <EnhancedLoading isLoading={true} />;
  }

  // No menu exists - show generation prompt
  if (!menu) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <FaCalendarAlt className="text-8xl text-green-600 mx-auto mb-6" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Weekly Meal Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Let AI create a personalized weekly menu based on your preferences!
          </p>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What you'll get:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <FaLeaf className="text-green-600 text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Personalized Meals</h3>
                  <p className="text-gray-600 text-sm">Based on your dietary preferences and restrictions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaUtensils className="text-green-600 text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">7 Days of Recipes</h3>
                  <p className="text-gray-600 text-sm">Breakfast, lunch, and dinner for the whole week</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaChartPie className="text-green-600 text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Nutrition Tracking</h3>
                  <p className="text-gray-600 text-sm">Complete nutritional information for each meal</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaShoppingCart className="text-green-600 text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Shopping List</h3>
                  <p className="text-gray-600 text-sm">Organized by category and nearby stores</p>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleGenerateMenu}
            disabled={generating}
            whileHover={{ scale: generating ? 1 : 1.05 }}
            whileTap={{ scale: generating ? 1 : 0.95 }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center space-x-3 mx-auto"
          >
            {generating ? (
              <>
                <FaSync className="animate-spin" />
                <span>Generating Your Menu...</span>
              </>
            ) : (
              <>
                <FaCalendarAlt />
                <span>Generate My Weekly Menu</span>
              </>
            )}
          </motion.button>

          {generating && (
            <p className="text-gray-600 mt-4">
              This may take 1-2 minutes as we create personalized meals for you...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Menu exists - show weekly view
  const currentDay = menu.days[selectedDay];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Weekly Menu
          </h1>
          <p className="text-gray-600">
            {new Date(menu.startDate).toLocaleDateString()} - {new Date(menu.endDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateShoppingList}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center space-x-2 shadow-lg"
          >
            <FaShoppingCart />
            <span>Shopping List</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateMenu}
            disabled={generating}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center space-x-2 shadow-lg disabled:opacity-50"
          >
            <FaSync className={generating ? 'animate-spin' : ''} />
            <span>Regenerate</span>
          </motion.button>
        </div>
      </div>

      {/* Nutrition Summary */}
      {menu.nutritionSummary && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <FaChartPie className="text-green-600" />
            <span>Weekly Nutrition Summary</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {menu.nutritionSummary.averageCaloriesPerDay}
              </div>
              <div className="text-sm text-gray-600">Avg Calories/Day</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {menu.nutritionSummary.totalProtein}g
              </div>
              <div className="text-sm text-gray-600">Total Protein</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {menu.nutritionSummary.totalCarbs}g
              </div>
              <div className="text-sm text-gray-600">Total Carbs</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">
                {menu.nutritionSummary.totalFat}g
              </div>
              <div className="text-sm text-gray-600">Total Fat</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {menu.nutritionSummary.totalFiber}g
              </div>
              <div className="text-sm text-gray-600">Total Fiber</div>
            </div>
          </div>
        </div>
      )}

      {/* Day Selector */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-8 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {DAYS.map((day, index) => (
            <motion.button
              key={day}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDay(index)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                selectedDay === index
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Meals for Selected Day */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentDay.day} - {new Date(currentDay.date).toLocaleDateString()}
            </h2>

            {currentDay.meals.map((meal, mealIndex) => (
              <motion.div
                key={mealIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mealIndex * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full capitalize">
                        {meal.mealType}
                      </span>
                      {meal.source === 'ai-generated' && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          🤖 AI Generated
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {meal.dishDetails?.name || 'Loading...'}
                    </h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSwapMeal(selectedDay, mealIndex)}
                    disabled={swapping === `${selectedDay}-${mealIndex}`}
                    className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center space-x-2 disabled:opacity-50"
                  >
                    {swapping === `${selectedDay}-${mealIndex}` ? (
                      <>
                        <FaSync className="animate-spin" />
                        <span>Swapping...</span>
                      </>
                    ) : (
                      <>
                        <FaExchangeAlt />
                        <span>Swap Meal</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {meal.dishDetails && (
                  <>
                    <p className="text-gray-600 mb-4">{meal.dishDetails.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <FaClock className="text-green-600" />
                        <span className="text-sm">
                          {(meal.dishDetails.prepTime || 0) + (meal.dishDetails.cookTime || 0)} min
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <FaUtensils className="text-green-600" />
                        <span className="text-sm capitalize">{meal.dishDetails.difficulty || 'Medium'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <FaFire className="text-orange-600" />
                        <span className="text-sm">
                          {meal.dishDetails.nutritionalInfo?.calories || 0} cal
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <FaLeaf className="text-green-600" />
                        <span className="text-sm">{meal.servings} servings</span>
                      </div>
                    </div>

                    {meal.dishDetails.nutritionalInfo && (
                      <div className="grid grid-cols-4 gap-2 bg-gray-50 rounded-lg p-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {meal.dishDetails.nutritionalInfo.protein || 0}g
                          </div>
                          <div className="text-xs text-gray-600">Protein</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-600">
                            {meal.dishDetails.nutritionalInfo.carbs || 0}g
                          </div>
                          <div className="text-xs text-gray-600">Carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">
                            {meal.dishDetails.nutritionalInfo.fat || 0}g
                          </div>
                          <div className="text-xs text-gray-600">Fat</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {meal.dishDetails.nutritionalInfo.fiber || 0}g
                          </div>
                          <div className="text-xs text-gray-600">Fiber</div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Shopping List Modal */}
      {showShoppingList && shoppingList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
                <FaShoppingCart className="text-green-600" />
                <span>Shopping List</span>
              </h2>
              <button
                onClick={() => setShowShoppingList(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6 bg-green-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {shoppingList.totalItems}
                  </div>
                  <div className="text-sm text-gray-600">Total Items</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    ${shoppingList.estimatedCost?.estimated || 0}
                  </div>
                  <div className="text-sm text-gray-600">Estimated Cost</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(shoppingList.byCategory).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span>{category}</span>
                    <span className="text-sm text-gray-500">({items.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
                      >
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.totalQuantity}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Used in: {item.usedIn.slice(0, 2).join(', ')}
                          {item.usedIn.length > 2 && ` +${item.usedIn.length - 2} more`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {shoppingList.nearbyStores && shoppingList.nearbyStores.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Nearby Stores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shoppingList.nearbyStores.slice(0, 4).map((storeData, index) => (
                    <div key={index} className="bg-blue-50 rounded-lg p-4">
                      <div className="font-semibold text-gray-900">{storeData.store.name}</div>
                      <div className="text-sm text-gray-600">{storeData.store.address}</div>
                      <div className="text-sm text-blue-600 mt-1">
                        {storeData.store.distance} km away
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Has {storeData.availableIngredients.length} of your ingredients
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default WeeklyMenu;
