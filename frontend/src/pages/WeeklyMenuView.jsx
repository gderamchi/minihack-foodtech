import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { weeklyMenuAPI } from '../services/api';
import MealCard from '../components/MealCard';
import SwapMealModal from '../components/SwapMealModal';
import { 
  FaCalendarAlt, 
  FaSync, 
  FaShoppingCart, 
  FaHeart,
  FaChartPie,
  FaDownload,
  FaPlus
} from 'react-icons/fa';

const DAYS = [
  { key: 'monday', label: 'Monday', emoji: '📅' },
  { key: 'tuesday', label: 'Tuesday', emoji: '📅' },
  { key: 'wednesday', label: 'Wednesday', emoji: '📅' },
  { key: 'thursday', label: 'Thursday', emoji: '📅' },
  { key: 'friday', label: 'Friday', emoji: '📅' },
  { key: 'saturday', label: 'Saturday', emoji: '🎉' },
  { key: 'sunday', label: 'Sunday', emoji: '☀️' }
];

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];

export default function WeeklyMenuView() {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'
  const [selectedDay, setSelectedDay] = useState(null);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentMenu();
  }, []);

  const fetchCurrentMenu = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const response = await weeklyMenuAPI.getCurrent(token, currentUser.uid);
      
      if (response.data) {
        setMenu(response.data);
      } else {
        // No menu exists, prompt to generate
        toast.info('No menu found. Generate your first weekly menu!');
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      if (error.response?.status === 404) {
        toast.info('No menu found. Generate your first weekly menu!');
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
      const token = await currentUser.getIdToken();
      
      toast.info('Generating your personalized weekly menu... This may take a minute!', {
        autoClose: false,
        toastId: 'generating'
      });
      
      const response = await weeklyMenuAPI.generate(token, currentUser.uid);
      setMenu(response.data);
      
      toast.dismiss('generating');
      toast.success('Your weekly menu is ready! 🎉');
    } catch (error) {
      console.error('Error generating menu:', error);
      toast.dismiss('generating');
      toast.error('Failed to generate menu. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSwapMeal = (day, mealType, meal) => {
    setSelectedMeal({ day, mealType, meal });
    setSwapModalOpen(true);
  };

  const handleSwapComplete = async (newMeal) => {
    try {
      const token = await currentUser.getIdToken();
      await weeklyMenuAPI.swapMeal(
        token,
        menu._id,
        selectedMeal.day,
        selectedMeal.mealType,
        currentUser.uid
      );
      
      // Refresh menu
      await fetchCurrentMenu();
      toast.success('Meal swapped successfully!');
      setSwapModalOpen(false);
    } catch (error) {
      console.error('Error swapping meal:', error);
      toast.error('Failed to swap meal');
    }
  };

  const handleViewShoppingList = () => {
    navigate('/shopping-list');
  };

  const handleToggleFavorite = async () => {
    try {
      const token = await currentUser.getIdToken();
      // TODO: Implement favorite toggle API
      toast.success(menu.isFavorite ? 'Removed from favorites' : 'Added to favorites!');
    } catch (error) {
      toast.error('Failed to update favorite status');
    }
  };

  const handleExportMenu = () => {
    // TODO: Implement PDF export
    toast.info('Export feature coming soon!');
  };

  const getNutritionSummary = () => {
    if (!menu?.nutritionSummary) return null;
    
    const { daily } = menu.nutritionSummary;
    return {
      calories: daily.calories || 0,
      protein: daily.protein || 0,
      carbs: daily.carbs || 0,
      fat: daily.fat || 0,
      fiber: daily.fiber || 0
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your menu...</p>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-12"
        >
          <div className="text-6xl mb-6">🍽️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No Weekly Menu Yet
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Generate your first personalized weekly menu based on your preferences!
          </p>
          <button
            onClick={handleGenerateMenu}
            disabled={generating}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition shadow-lg text-lg"
          >
            {generating ? (
              <>
                <FaSync className="inline animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <FaPlus className="inline mr-2" />
                Generate Weekly Menu
              </>
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  const nutrition = getNutritionSummary();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <FaCalendarAlt className="inline mr-3 text-green-600" />
              Your Weekly Menu
            </h1>
            <p className="text-gray-600">
              {new Date(menu.weekStart).toLocaleDateString()} - {new Date(menu.weekEnd).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleToggleFavorite}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                menu.isFavorite
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaHeart className="inline mr-2" />
              {menu.isFavorite ? 'Favorited' : 'Favorite'}
            </button>
            
            <button
              onClick={handleViewShoppingList}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition"
            >
              <FaShoppingCart className="inline mr-2" />
              Shopping List
            </button>
            
            <button
              onClick={handleExportMenu}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition"
            >
              <FaDownload className="inline mr-2" />
              Export
            </button>
            
            <button
              onClick={handleGenerateMenu}
              disabled={generating}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition shadow-lg"
            >
              <FaSync className={`inline mr-2 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Generating...' : 'Regenerate'}
            </button>
          </div>
        </div>
      </div>

      {/* Nutrition Summary */}
      {nutrition && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center mb-4">
            <FaChartPie className="text-2xl text-green-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Daily Nutrition Average</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{nutrition.calories}</div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{nutrition.protein}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{nutrition.carbs}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{nutrition.fat}g</div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{nutrition.fiber}g</div>
              <div className="text-sm text-gray-600">Fiber</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1 inline-flex">
          <button
            onClick={() => setViewMode('week')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              viewMode === 'week'
                ? 'bg-white text-green-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Week View
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              viewMode === 'day'
                ? 'bg-white text-green-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Day View
          </button>
        </div>
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {DAYS.map((day, dayIndex) => (
            <motion.div
              key={day.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              {/* Day Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-2">{day.emoji}</span>
                  {day.label}
                </h3>
              </div>

              {/* Meals */}
              <div className="p-4 space-y-4">
                {MEAL_TYPES.map((mealType) => {
                  const meal = menu.menu?.[day.key]?.[mealType];
                  return (
                    <MealCard
                      key={mealType}
                      mealType={mealType}
                      meal={meal}
                      onSwap={() => handleSwapMeal(day.key, mealType, meal)}
                      compact={true}
                    />
                  );
                })}
              </div>

              {/* View Day Button */}
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedDay(day.key);
                    setViewMode('day');
                  }}
                  className="w-full py-2 text-green-600 font-medium hover:bg-green-50 rounded-lg transition"
                >
                  View Full Day →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Day Selector */}
          <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
            {DAYS.map((day) => (
              <button
                key={day.key}
                onClick={() => setSelectedDay(day.key)}
                className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedDay === day.key
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day.emoji} {day.label}
              </button>
            ))}
          </div>

          {/* Selected Day Meals */}
          {selectedDay && (
            <div className="space-y-6">
              {MEAL_TYPES.map((mealType) => {
                const meal = menu.menu?.[selectedDay]?.[mealType];
                return (
                  <MealCard
                    key={mealType}
                    mealType={mealType}
                    meal={meal}
                    onSwap={() => handleSwapMeal(selectedDay, mealType, meal)}
                    compact={false}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Swap Meal Modal */}
      <SwapMealModal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        currentMeal={selectedMeal}
        onSwapComplete={handleSwapComplete}
      />
    </div>
  );
}
