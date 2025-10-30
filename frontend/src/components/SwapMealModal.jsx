import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSync, FaSearch, FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { dishesAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function SwapMealModal({ isOpen, onClose, currentMeal, onSwapComplete }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDish, setSelectedDish] = useState(null);
  const [feedback, setFeedback] = useState('');
  
  const { currentUser } = useAuth();

  useEffect(() => {
    if (isOpen && currentMeal) {
      fetchSuggestions();
    }
  }, [isOpen, currentMeal]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      // TODO: Implement API to get meal suggestions based on preferences
      // For now, generate some mock suggestions
      const mockSuggestions = [
        {
          _id: '1',
          name: 'Quinoa Buddha Bowl',
          description: 'Colorful bowl with quinoa, roasted vegetables, and tahini dressing',
          prepTime: 15,
          cookTime: 25,
          calories: 450,
          protein: 15,
          image: null
        },
        {
          _id: '2',
          name: 'Lentil Curry',
          description: 'Creamy coconut curry with red lentils and aromatic spices',
          prepTime: 10,
          cookTime: 30,
          calories: 380,
          protein: 18,
          image: null
        },
        {
          _id: '3',
          name: 'Chickpea Pasta',
          description: 'High-protein pasta with chickpeas, tomatoes, and fresh basil',
          prepTime: 10,
          cookTime: 20,
          calories: 420,
          protein: 20,
          image: null
        },
        {
          _id: '4',
          name: 'Tofu Stir-Fry',
          description: 'Crispy tofu with mixed vegetables in savory sauce',
          prepTime: 15,
          cookTime: 15,
          calories: 350,
          protein: 22,
          image: null
        }
      ];
      
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!selectedDish) {
      toast.error('Please select a dish to swap');
      return;
    }

    try {
      await onSwapComplete(selectedDish, feedback);
      setSelectedDish(null);
      setFeedback('');
    } catch (error) {
      console.error('Error swapping meal:', error);
    }
  };

  const handleGenerateNew = async () => {
    try {
      setLoading(true);
      toast.info('Generating new suggestions...');
      
      // TODO: Call API to generate new AI suggestions
      await fetchSuggestions();
      
      toast.success('New suggestions generated!');
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to generate new suggestions');
    } finally {
      setLoading(false);
    }
  };

  const filteredSuggestions = suggestions.filter(dish =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dish.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  const currentDish = currentMeal?.meal?.customDish || currentMeal?.meal?.dish;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Swap Meal</h2>
                <p className="text-white/80">
                  {currentMeal?.mealType && (
                    <span className="capitalize">{currentMeal.mealType}</span>
                  )}
                  {currentMeal?.day && (
                    <span className="capitalize"> - {currentMeal.day}</span>
                  )}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <FaTimes className="text-2xl text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Current Meal */}
            {currentDish && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Current Meal:</p>
                <h3 className="text-xl font-bold text-gray-900">{currentDish.name}</h3>
                {currentDish.description && (
                  <p className="text-gray-600 mt-1">{currentDish.description}</p>
                )}
              </div>
            )}

            {/* Search & Generate */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search suggestions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleGenerateNew}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition shadow-lg whitespace-nowrap"
              >
                <FaSync className={`inline mr-2 ${loading ? 'animate-spin' : ''}`} />
                Generate New
              </button>
            </div>

            {/* Suggestions Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading suggestions...</p>
              </div>
            ) : filteredSuggestions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No suggestions found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {filteredSuggestions.map((dish) => (
                  <motion.div
                    key={dish._id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedDish(dish)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                      selectedDish?._id === dish._id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-900 flex-1">{dish.name}</h4>
                      {selectedDish?._id === dish._id && (
                        <div className="text-green-500">
                          <FaHeart className="text-xl" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{dish.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>⏱️ {dish.prepTime + dish.cookTime}min</span>
                      <span>🔥 {dish.calories}cal</span>
                      <span>💪 {dish.protein}g protein</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Feedback */}
            {selectedDish && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why are you swapping? (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="e.g., Don't like mushrooms, want something quicker, etc."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your feedback helps us improve future suggestions
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSwap}
                disabled={!selectedDish}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
              >
                Swap Meal
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
