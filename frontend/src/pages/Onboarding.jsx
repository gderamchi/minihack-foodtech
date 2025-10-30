import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usersAPI } from '../services/api';
import { toast } from 'react-toastify';

const STEPS = [
  {
    id: 1,
    title: 'Welcome! 🌱',
    subtitle: "Let's personalize your vegan journey",
    type: 'welcome'
  },
  {
    id: 2,
    title: 'Your Dietary Goals',
    subtitle: 'What brings you to plant-based eating?',
    type: 'goals'
  },
  {
    id: 3,
    title: 'Current Diet',
    subtitle: 'Where are you starting from?',
    type: 'currentDiet'
  },
  {
    id: 4,
    title: 'Dietary Restrictions',
    subtitle: 'Any allergies or restrictions we should know about?',
    type: 'restrictions'
  },
  {
    id: 5,
    title: 'Cooking Experience',
    subtitle: 'How comfortable are you in the kitchen?',
    type: 'cookingLevel'
  },
  {
    id: 6,
    title: 'Meal Preferences',
    subtitle: 'What types of meals do you enjoy?',
    type: 'mealPreferences'
  },
  {
    id: 7,
    title: 'Your Location',
    subtitle: 'Help us find stores near you',
    type: 'location'
  },
  {
    id: 8,
    title: 'All Set! 🎉',
    subtitle: 'Your personalized meal plan is ready',
    type: 'complete'
  }
];

const DIETARY_GOALS = [
  { id: 'health', label: 'Better Health', icon: '💪', description: 'Improve overall wellness' },
  { id: 'environment', label: 'Environment', icon: '🌍', description: 'Reduce carbon footprint' },
  { id: 'animals', label: 'Animal Welfare', icon: '🐮', description: 'Ethical considerations' },
  { id: 'weight', label: 'Weight Management', icon: '⚖️', description: 'Healthy weight goals' },
  { id: 'energy', label: 'More Energy', icon: '⚡', description: 'Boost daily energy' },
  { id: 'curious', label: 'Just Curious', icon: '🤔', description: 'Exploring options' }
];

const CURRENT_DIETS = [
  { id: 'omnivore', label: 'Omnivore', icon: '🍖', description: 'Eat everything' },
  { id: 'flexitarian', label: 'Flexitarian', icon: '🥗', description: 'Mostly plant-based' },
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥕', description: 'No meat' },
  { id: 'vegan', label: 'Vegan', icon: '🌱', description: 'Fully plant-based' }
];

const RESTRICTIONS = [
  { id: 'gluten', label: 'Gluten-Free', icon: '🌾' },
  { id: 'nuts', label: 'Nut Allergy', icon: '🥜' },
  { id: 'soy', label: 'Soy-Free', icon: '🫘' },
  { id: 'oil', label: 'Oil-Free', icon: '🫗' },
  { id: 'sugar', label: 'Low Sugar', icon: '🍬' },
  { id: 'none', label: 'No Restrictions', icon: '✅' }
];

const COOKING_LEVELS = [
  { id: 'beginner', label: 'Beginner', icon: '👶', description: 'Simple recipes please!' },
  { id: 'intermediate', label: 'Intermediate', icon: '👨‍🍳', description: 'I can follow recipes' },
  { id: 'advanced', label: 'Advanced', icon: '⭐', description: 'I love cooking!' }
];

const MEAL_TYPES = [
  { id: 'quick', label: 'Quick Meals', icon: '⚡', description: 'Under 30 minutes' },
  { id: 'batch', label: 'Batch Cooking', icon: '🍱', description: 'Meal prep friendly' },
  { id: 'gourmet', label: 'Gourmet', icon: '👨‍🍳', description: 'Restaurant quality' },
  { id: 'comfort', label: 'Comfort Food', icon: '🍲', description: 'Hearty & satisfying' },
  { id: 'healthy', label: 'Health-Focused', icon: '🥗', description: 'Nutrient-dense' },
  { id: 'international', label: 'International', icon: '🌍', description: 'World cuisines' }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { currentUser, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    goals: [],
    currentDiet: '',
    restrictions: [],
    cookingLevel: '',
    mealPreferences: [],
    location: {
      address: '',
      coordinates: [0, 0]
    }
  });

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleSelection = (field, value) => {
    setFormData(prev => {
      if (Array.isArray(prev[field])) {
        const newArray = prev[field].includes(value)
          ? prev[field].filter(item => item !== value)
          : [...prev[field], value];
        return { ...prev, [field]: newArray };
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: [position.coords.longitude, position.coords.latitude]
            }
          }));
          toast.success('Location detected!');
        },
        (error) => {
          console.error('Location error:', error);
          toast.error('Could not detect location. Please enter manually.');
        }
      );
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      
      await usersAPI.completeOnboarding({
        preferences: {
          dietaryGoals: formData.goals,
          currentDiet: formData.currentDiet,
          dietaryRestrictions: formData.restrictions,
          cookingLevel: formData.cookingLevel,
          mealPreferences: formData.mealPreferences
        },
        location: formData.location
      }, token);

      await refreshProfile();
      toast.success('Welcome to your vegan journey! 🌱');
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step.type) {
      case 'welcome':
        return true;
      case 'goals':
        return formData.goals.length > 0;
      case 'currentDiet':
        return formData.currentDiet !== '';
      case 'restrictions':
        return formData.restrictions.length > 0;
      case 'cookingLevel':
        return formData.cookingLevel !== '';
      case 'mealPreferences':
        return formData.mealPreferences.length > 0;
      case 'location':
        return true; // Optional
      case 'complete':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm font-medium text-green-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {step.title}
              </h2>
              <p className="text-gray-600 text-lg">
                {step.subtitle}
              </p>
            </div>

            {/* Step Content */}
            <div className="mb-8">
              {step.type === 'welcome' && (
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4">🌱</div>
                  <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                    We'll help you transition to a delicious plant-based diet with personalized meal plans, 
                    AI-powered recipe suggestions, and local store recommendations.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="text-3xl mb-2">🤖</div>
                      <p className="text-sm font-medium text-gray-700">AI Recipes</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="text-3xl mb-2">📅</div>
                      <p className="text-sm font-medium text-gray-700">Meal Plans</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="text-3xl mb-2">🛒</div>
                      <p className="text-sm font-medium text-gray-700">Store Finder</p>
                    </div>
                  </div>
                </div>
              )}

              {step.type === 'goals' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DIETARY_GOALS.map(goal => (
                    <motion.button
                      key={goal.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleSelection('goals', goal.id)}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        formData.goals.includes(goal.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-4xl">{goal.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{goal.label}</h3>
                          <p className="text-sm text-gray-600">{goal.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {step.type === 'currentDiet' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CURRENT_DIETS.map(diet => (
                    <motion.button
                      key={diet.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleSelection('currentDiet', diet.id)}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        formData.currentDiet === diet.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-4xl">{diet.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{diet.label}</h3>
                          <p className="text-sm text-gray-600">{diet.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {step.type === 'restrictions' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {RESTRICTIONS.map(restriction => (
                    <motion.button
                      key={restriction.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleSelection('restrictions', restriction.id)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.restrictions.includes(restriction.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{restriction.icon}</div>
                      <p className="text-sm font-medium text-gray-900">{restriction.label}</p>
                    </motion.button>
                  ))}
                </div>
              )}

              {step.type === 'cookingLevel' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {COOKING_LEVELS.map(level => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleSelection('cookingLevel', level.id)}
                      className={`p-6 rounded-xl border-2 transition-all text-center ${
                        formData.cookingLevel === level.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="text-4xl mb-3">{level.icon}</div>
                      <h3 className="font-semibold text-gray-900 mb-1">{level.label}</h3>
                      <p className="text-sm text-gray-600">{level.description}</p>
                    </motion.button>
                  ))}
                </div>
              )}

              {step.type === 'mealPreferences' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MEAL_TYPES.map(meal => (
                    <motion.button
                      key={meal.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleSelection('mealPreferences', meal.id)}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        formData.mealPreferences.includes(meal.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-4xl">{meal.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{meal.label}</h3>
                          <p className="text-sm text-gray-600">{meal.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {step.type === 'location' && (
                <div className="max-w-md mx-auto space-y-6">
                  <div className="text-center">
                    <div className="text-5xl mb-4">📍</div>
                    <p className="text-gray-600 mb-6">
                      We'll use your location to find nearby stores with vegan ingredients
                    </p>
                  </div>
                  
                  <button
                    onClick={handleLocationRequest}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition"
                  >
                    📍 Use My Current Location
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or enter manually</span>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter your city or address"
                    value={formData.location.address}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, address: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />

                  <p className="text-xs text-gray-500 text-center">
                    You can skip this step and add your location later
                  </p>
                </div>
              )}

              {step.type === 'complete' && (
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                    Your personalized vegan meal plan is ready! We've tailored everything based on your preferences.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="p-6 bg-green-50 rounded-xl">
                      <div className="text-3xl mb-2">✅</div>
                      <p className="font-semibold text-gray-900 mb-1">Profile Complete</p>
                      <p className="text-sm text-gray-600">All set up!</p>
                    </div>
                    <div className="p-6 bg-green-50 rounded-xl">
                      <div className="text-3xl mb-2">🍽️</div>
                      <p className="font-semibold text-gray-900 mb-1">Recipes Ready</p>
                      <p className="text-sm text-gray-600">Personalized for you</p>
                    </div>
                    <div className="p-6 bg-green-50 rounded-xl">
                      <div className="text-3xl mb-2">🛒</div>
                      <p className="font-semibold text-gray-900 mb-1">Stores Found</p>
                      <p className="text-sm text-gray-600">Near your location</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-3 text-gray-600 font-semibold hover:text-gray-900 disabled:opacity-0 disabled:cursor-not-allowed transition"
              >
                ← Back
              </button>

              {currentStep < STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
                >
                  {loading ? 'Setting up...' : 'Get Started! 🚀'}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
