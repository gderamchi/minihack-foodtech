import { motion } from 'framer-motion';
import { FaUtensils, FaClock, FaExchangeAlt, FaFire, FaLeaf } from 'react-icons/fa';

const MEAL_ICONS = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍽️',
  snacks: '🍿'
};

const MEAL_COLORS = {
  breakfast: 'from-yellow-400 to-orange-500',
  lunch: 'from-green-400 to-emerald-500',
  dinner: 'from-blue-400 to-indigo-500',
  snacks: 'from-purple-400 to-pink-500'
};

export default function MealCard({ mealType, meal, onSwap, compact = false }) {
  if (!meal || (!meal.dish && !meal.customDish)) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-400">
          <FaUtensils className="text-3xl mx-auto mb-2" />
          <p className="text-sm">No {mealType} planned</p>
        </div>
      </div>
    );
  }

  const dishData = meal.customDish || meal.dish;
  const dishName = dishData.name || 'Unnamed Dish';
  const description = dishData.description || '';
  const prepTime = dishData.prepTime || 0;
  const cookTime = dishData.cookTime || 0;
  const totalTime = prepTime + cookTime;
  const servings = meal.adjustedServings || dishData.servings || 1;
  const calories = dishData.nutritionalInfo?.calories || dishData.calories || 0;
  const protein = dishData.nutritionalInfo?.protein || dishData.protein || 0;

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-green-300 transition"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{MEAL_ICONS[mealType]}</span>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">{mealType}</p>
              <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{dishName}</h4>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <span className="flex items-center gap-1">
            <FaClock className="text-gray-400" />
            {totalTime}min
          </span>
          <span className="flex items-center gap-1">
            <FaFire className="text-orange-400" />
            {calories}cal
          </span>
        </div>

        <button
          onClick={onSwap}
          className="w-full py-1.5 text-xs bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition font-medium"
        >
          <FaExchangeAlt className="inline mr-1" />
          Swap
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${MEAL_COLORS[mealType]} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{MEAL_ICONS[mealType]}</span>
            <div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-wide">{mealType}</p>
              <h3 className="text-2xl font-bold text-white">{dishName}</h3>
            </div>
          </div>
          <button
            onClick={onSwap}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition backdrop-blur-sm"
          >
            <FaExchangeAlt className="inline mr-2" />
            Swap
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        {description && (
          <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <FaClock className="text-2xl text-gray-400 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Time</p>
            <p className="text-lg font-bold text-gray-900">{totalTime}min</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <FaFire className="text-2xl text-orange-500 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Calories</p>
            <p className="text-lg font-bold text-gray-900">{calories}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <FaLeaf className="text-2xl text-blue-500 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Protein</p>
            <p className="text-lg font-bold text-gray-900">{protein}g</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <FaUtensils className="text-2xl text-green-500 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Servings</p>
            <p className="text-lg font-bold text-gray-900">{servings}</p>
          </div>
        </div>

        {/* Ingredients */}
        {(meal.adjustedIngredients || dishData.ingredients) && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-green-600 mr-2">🥕</span>
              Ingredients
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(meal.adjustedIngredients || dishData.ingredients).slice(0, 8).map((ingredient, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <span className="text-green-500 mr-2">•</span>
                    <span>
                      {ingredient.quantity && <span className="font-medium">{ingredient.quantity} </span>}
                      {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
              {(meal.adjustedIngredients || dishData.ingredients).length > 8 && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  +{(meal.adjustedIngredients || dishData.ingredients).length - 8} more ingredients
                </p>
              )}
            </div>
          </div>
        )}

        {/* Instructions Preview */}
        {dishData.instructions && dishData.instructions.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-green-600 mr-2">📝</span>
              Instructions
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <ol className="space-y-2">
                {dishData.instructions.slice(0, 3).map((instruction, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <span className="font-bold text-green-600 mr-3">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
              {dishData.instructions.length > 3 && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  +{dishData.instructions.length - 3} more steps
                </p>
              )}
            </div>
          </div>
        )}

        {/* Nutrition Details */}
        {dishData.nutritionalInfo && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Nutrition Facts</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {dishData.nutritionalInfo.carbs && (
                <div className="text-center">
                  <p className="text-xs text-gray-600">Carbs</p>
                  <p className="text-sm font-bold text-gray-900">{dishData.nutritionalInfo.carbs}g</p>
                </div>
              )}
              {dishData.nutritionalInfo.fat && (
                <div className="text-center">
                  <p className="text-xs text-gray-600">Fat</p>
                  <p className="text-sm font-bold text-gray-900">{dishData.nutritionalInfo.fat}g</p>
                </div>
              )}
              {dishData.nutritionalInfo.fiber && (
                <div className="text-center">
                  <p className="text-xs text-gray-600">Fiber</p>
                  <p className="text-sm font-bold text-gray-900">{dishData.nutritionalInfo.fiber}g</p>
                </div>
              )}
              {dishData.nutritionalInfo.sugar && (
                <div className="text-center">
                  <p className="text-xs text-gray-600">Sugar</p>
                  <p className="text-sm font-bold text-gray-900">{dishData.nutritionalInfo.sugar}g</p>
                </div>
              )}
              {dishData.nutritionalInfo.sodium && (
                <div className="text-center">
                  <p className="text-xs text-gray-600">Sodium</p>
                  <p className="text-sm font-bold text-gray-900">{dishData.nutritionalInfo.sodium}mg</p>
                </div>
              )}
              {dishData.nutritionalInfo.vitamins && (
                <div className="text-center">
                  <p className="text-xs text-gray-600">Vitamins</p>
                  <p className="text-sm font-bold text-green-600">✓</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
