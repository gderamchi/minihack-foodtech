import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usersAPI } from '../services/api';
import { toast } from 'react-toastify';

const STEPS = [
  { id: 1, title: 'Welcome! 🌱', subtitle: "Let's personalize your vegan journey", type: 'welcome' },
  { id: 2, title: 'Personal Information', subtitle: 'Tell us about yourself', type: 'personal' },
  { id: 3, title: 'Your Household', subtitle: 'Who are you cooking for?', type: 'household' },
  { id: 4, title: 'Dietary Goals', subtitle: 'What brings you to plant-based eating?', type: 'goals' },
  { id: 5, title: 'Current Diet', subtitle: 'Where are you starting from?', type: 'currentDiet' },
  { id: 6, title: 'Dietary Restrictions', subtitle: 'Any allergies or restrictions?', type: 'restrictions' },
  { id: 7, title: 'Food Allergies', subtitle: 'What should we avoid?', type: 'allergies' },
  { id: 8, title: 'Favorite Cuisines', subtitle: 'What flavors do you love?', type: 'cuisines' },
  { id: 9, title: 'Ingredient Preferences', subtitle: 'Likes and dislikes', type: 'ingredients' },
  { id: 10, title: 'Texture & Flavor', subtitle: 'How do you like your food?', type: 'textures' },
  { id: 11, title: 'Cooking Skills', subtitle: 'Your experience in the kitchen', type: 'cooking' },
  { id: 12, title: 'Kitchen Equipment', subtitle: 'What tools do you have?', type: 'equipment' },
  { id: 13, title: 'Meal Planning', subtitle: 'Your eating habits', type: 'mealPlanning' },
  { id: 14, title: 'Health Goals', subtitle: 'What are you aiming for?', type: 'health' },
  { id: 15, title: 'Budget & Shopping', subtitle: 'Your shopping preferences', type: 'budget' },
  { id: 16, title: 'Automation', subtitle: 'Let us help you plan ahead', type: 'automation' },
  { id: 17, title: 'Your Location', subtitle: 'Find stores near you', type: 'location' },
  { id: 18, title: 'Additional Notes', subtitle: 'Anything else we should know?', type: 'notes' },
  { id: 19, title: 'All Set! 🎉', subtitle: 'Your personalized plan is ready', type: 'complete' }
];

const DIETARY_GOALS = [
  { id: 'health', label: 'Better Health', icon: '💪' },
  { id: 'environment', label: 'Environment', icon: '🌍' },
  { id: 'animals', label: 'Animal Welfare', icon: '🐮' },
  { id: 'weight', label: 'Weight Management', icon: '⚖️' },
  { id: 'energy', label: 'More Energy', icon: '⚡' },
  { id: 'curious', label: 'Just Curious', icon: '🤔' }
];

const CURRENT_DIETS = [
  { id: 'omnivore', label: 'Omnivore', icon: '🍖' },
  { id: 'flexitarian', label: 'Flexitarian', icon: '🥗' },
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥕' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' }
];

const RESTRICTIONS = [
  { id: 'gluten', label: 'Gluten-Free', icon: '🌾' },
  { id: 'nuts', label: 'Nut Allergy', icon: '🥜' },
  { id: 'soy', label: 'Soy-Free', icon: '🫘' },
  { id: 'oil', label: 'Oil-Free', icon: '🫗' },
  { id: 'sugar', label: 'Low Sugar', icon: '🍬' },
  { id: 'none', label: 'No Restrictions', icon: '✅' }
];

const ALLERGIES = [
  { id: 'peanuts', label: 'Peanuts', icon: '🥜' },
  { id: 'tree-nuts', label: 'Tree Nuts', icon: '🌰' },
  { id: 'soy', label: 'Soy', icon: '🫘' },
  { id: 'wheat', label: 'Wheat/Gluten', icon: '🌾' },
  { id: 'sesame', label: 'Sesame', icon: '🫘' },
  { id: 'none', label: 'No Allergies', icon: '✅' }
];

const CUISINES = [
  { id: 'italian', label: 'Italian', icon: '🇮🇹' },
  { id: 'mexican', label: 'Mexican', icon: '🇲🇽' },
  { id: 'asian', label: 'Asian', icon: '🍜' },
  { id: 'indian', label: 'Indian', icon: '🇮🇳' },
  { id: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
  { id: 'american', label: 'American', icon: '🇺🇸' },
  { id: 'french', label: 'French', icon: '🇫🇷' },
  { id: 'japanese', label: 'Japanese', icon: '🇯🇵' },
  { id: 'thai', label: 'Thai', icon: '🇹🇭' },
  { id: 'middle-eastern', label: 'Middle Eastern', icon: '🧆' }
];

const TEXTURES = [
  { id: 'crunchy', label: 'Crunchy', icon: '🥕' },
  { id: 'creamy', label: 'Creamy', icon: '🥑' },
  { id: 'chewy', label: 'Chewy', icon: '🍞' },
  { id: 'soft', label: 'Soft', icon: '🍌' },
  { id: 'crispy', label: 'Crispy', icon: '🥔' }
];

const FLAVORS = [
  { id: 'spicy', label: 'Spicy', icon: '🌶️' },
  { id: 'sweet', label: 'Sweet', icon: '🍯' },
  { id: 'savory', label: 'Savory', icon: '🧂' },
  { id: 'sour', label: 'Sour', icon: '🍋' },
  { id: 'umami', label: 'Umami', icon: '🍄' }
];

const COOKING_LEVELS = [
  { id: 'beginner', label: 'Beginner', icon: '👶', description: 'Simple recipes' },
  { id: 'intermediate', label: 'Intermediate', icon: '👨‍🍳', description: 'Can follow recipes' },
  { id: 'advanced', label: 'Advanced', icon: '⭐', description: 'Love cooking!' }
];

const EQUIPMENT = [
  { id: 'stove', label: 'Stove/Oven', icon: '🔥' },
  { id: 'microwave', label: 'Microwave', icon: '📻' },
  { id: 'blender', label: 'Blender', icon: '🌀' },
  { id: 'food-processor', label: 'Food Processor', icon: '⚙️' },
  { id: 'air-fryer', label: 'Air Fryer', icon: '🍟' },
  { id: 'instant-pot', label: 'Instant Pot', icon: '🍲' },
  { id: 'slow-cooker', label: 'Slow Cooker', icon: '⏰' },
  { id: 'rice-cooker', label: 'Rice Cooker', icon: '🍚' }
];

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'lunch', label: 'Lunch', icon: '🥗' },
  { id: 'dinner', label: 'Dinner', icon: '🍽️' },
  { id: 'snacks', label: 'Snacks', icon: '🍿' }
];

const HEALTH_GOALS = [
  { id: 'weight-loss', label: 'Weight Loss', icon: '⚖️' },
  { id: 'muscle-gain', label: 'Muscle Gain', icon: '💪' },
  { id: 'heart-health', label: 'Heart Health', icon: '❤️' },
  { id: 'energy', label: 'More Energy', icon: '⚡' },
  { id: 'digestion', label: 'Better Digestion', icon: '🌿' },
  { id: 'general', label: 'General Health', icon: '🏃' }
];

const HOUSEHOLD_TYPES = [
  { id: 'single', label: 'Just Me', icon: '👤' },
  { id: 'couple', label: 'Couple', icon: '👫' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'roommates', label: 'Roommates', icon: '🏠' }
];

export default function ComprehensiveOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { currentUser, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: '',
    householdSize: 1,
    householdType: '',
    goals: [],
    currentDiet: '',
    restrictions: [],
    allergies: [],
    favoriteCuisines: [],
    dislikedIngredients: '',
    preferredIngredients: '',
    spiceTolerance: 'medium',
    texturePreferences: [],
    flavorProfiles: [],
    skillLevel: '',
    timeAvailable: 30,
    equipment: [],
    mealsPerDay: 3,
    mealTypes: [],
    primaryGoal: '',
    calorieTarget: 2000,
    budget: 'medium',
    shoppingPreference: 'weekly',
    automationEnabled: false,
    startDay: 'sunday',
    daysInAdvance: 7,
    location: { address: '', coordinates: [0, 0] },
    additionalNotes: ''
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
      
      // Save complete onboarding data
      await usersAPI.saveOnboardingStep(
        token,
        currentUser.uid,
        19,
        {
          personal: {
            age: formData.age,
            householdSize: formData.householdSize,
            householdType: formData.householdType
          },
          dietary: {
            goals: formData.goals,
            currentDiet: formData.currentDiet,
            restrictions: formData.restrictions,
            allergies: formData.allergies
          },
          foodPreferences: {
            favoriteCuisines: formData.favoriteCuisines,
            dislikedIngredients: formData.dislikedIngredients.split(',').map(i => i.trim()).filter(Boolean),
            preferredIngredients: formData.preferredIngredients.split(',').map(i => i.trim()).filter(Boolean),
            spiceTolerance: formData.spiceTolerance,
            texturePreferences: formData.texturePreferences,
            flavorProfiles: formData.flavorProfiles
          },
          cooking: {
            skillLevel: formData.skillLevel,
            timeAvailable: formData.timeAvailable,
            equipment: formData.equipment
          },
          mealPlanning: {
            mealsPerDay: formData.mealsPerDay,
            mealTypes: formData.mealTypes,
            budget: formData.budget,
            shoppingPreference: formData.shoppingPreference
          },
          health: {
            primaryGoal: formData.primaryGoal,
            calorieTarget: formData.calorieTarget
          },
          automation: {
            enabled: formData.automationEnabled,
            startDay: formData.startDay,
            daysInAdvance: formData.daysInAdvance
          },
          location: formData.location,
          additionalNotes: formData.additionalNotes
        }
      );

      // Mark onboarding as complete
      await usersAPI.completeOnboarding(token, currentUser.uid);

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
      case 'welcome': return true;
      case 'personal': return formData.age !== '';
      case 'household': return formData.householdType !== '';
      case 'goals': return formData.goals.length > 0;
      case 'currentDiet': return formData.currentDiet !== '';
      case 'restrictions': return formData.restrictions.length > 0;
      case 'allergies': return formData.allergies.length > 0;
      case 'cuisines': return formData.favoriteCuisines.length > 0;
      case 'ingredients': return true;
      case 'textures': return formData.texturePreferences.length > 0 && formData.flavorProfiles.length > 0;
      case 'cooking': return formData.skillLevel !== '';
      case 'equipment': return formData.equipment.length > 0;
      case 'mealPlanning': return formData.mealTypes.length > 0;
      case 'health': return formData.primaryGoal !== '';
      case 'budget': return true;
      case 'automation': return true;
      case 'location': return true;
      case 'notes': return true;
      case 'complete': return true;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (step.type) {
      case 'welcome':
        return (
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
            <p className="text-sm text-gray-500 mt-6">
              This comprehensive questionnaire will take about 10-15 minutes. Your answers help us create the perfect personalized experience!
            </p>
          </div>
        );

      case 'personal':
        return (
          <div className="space-y-6 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="Enter your age"
              />
            </div>
          </div>
        );

      case 'household':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {HOUSEHOLD_TYPES.map(type => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, householdType: type.id }));
                    if (type.id === 'single') {
                      setFormData(prev => ({ ...prev, householdSize: 1 }));
                    }
                  }}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.householdType === type.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{type.icon}</div>
                  <p className="text-sm font-medium text-gray-900">{type.label}</p>
                </motion.button>
              ))}
            </div>
            
            {formData.householdType && formData.householdType !== 'single' && (
              <div className="max-w-md mx-auto mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many people in your household?
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.householdSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, householdSize: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
          </div>
        );

      case 'goals':
        return (
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
                    <h3 className="font-semibold text-gray-900">{goal.label}</h3>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 'currentDiet':
        return (
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
                    <h3 className="font-semibold text-gray-900">{diet.label}</h3>
                    <p className="text-sm text-gray-600">{diet.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 'restrictions':
        return (
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
        );

      case 'allergies':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ALLERGIES.map(allergy => (
              <motion.button
                key={allergy.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSelection('allergies', allergy.id)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  formData.allergies.includes(allergy.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="text-3xl mb-2">{allergy.icon}</div>
                <p className="text-sm font-medium text-gray-900">{allergy.label}</p>
              </motion.button>
            ))}
          </div>
        );

      case 'cuisines':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CUISINES.map(cuisine => (
              <motion.button
                key={cuisine.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSelection('favoriteCuisines', cuisine.id)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  formData.favoriteCuisines.includes(cuisine.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="text-3xl mb-2">{cuisine.icon}</div>
                <p className="text-sm font-medium text-gray-900">{cuisine.label}</p>
              </motion.button>
            ))}
          </div>
        );

      case 'ingredients':
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients you LOVE (comma-separated)
              </label>
              <textarea
                value={formData.preferredIngredients}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredIngredients: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="e.g., avocado, chickpeas, mushrooms, tofu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients you DISLIKE (comma-separated)
              </label>
              <textarea
                value={formData.dislikedIngredients}
                onChange={(e) => setFormData(prev => ({ ...prev, dislikedIngredients: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="e.g., cilantro, olives, eggplant"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spice Tolerance
              </label>
              <select
                value={formData.spiceTolerance}
                onChange={(e) => setFormData(prev => ({ ...prev, spiceTolerance: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                <option value="none">No Spice</option>
                <option value="mild">Mild</option>
                <option value="medium">Medium</option>
                <option value="hot">Hot</option>
                <option value="very-hot">Very Hot</option>
              </select>
            </div>
          </div>
        );

      case 'textures':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Texture Preferences</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {TEXTURES.map(texture => (
                  <motion.button
                    key={texture.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSelection('texturePreferences', texture.id)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.texturePreferences.includes(texture.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{texture.icon}</div>
                    <p className="text-sm font-medium text-gray-900">{texture.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Flavor Profiles</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {FLAVORS.map(flavor => (
                  <motion.button
                    key={flavor.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSelection('flavorProfiles', flavor.id)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.flavorProfiles.includes(flavor.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{flavor.icon}</div>
                    <p className="text-sm font-medium text-gray-900">{flavor.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'cooking':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COOKING_LEVELS.map(level => (
                <motion.button
                  key={level.id}
                  whileHover={{ scale:
