import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usersAPI } from '../services/api';
import { toast } from 'react-toastify';

const STEPS = [
  { id: 1, title: 'Welcome! 🌱', subtitle: "Let's personalize your vegan journey", type: 'welcome' },
  { id: 2, title: 'Personal Info', subtitle: 'Tell us about yourself', type: 'personal' },
  { id: 3, title: 'Your Household', subtitle: 'Who are you cooking for?', type: 'household' },
  { id: 4, title: 'Your Vegan Journey', subtitle: 'Where are you in your transition?', type: 'veganJourney' },
  { id: 5, title: 'Dietary Goals', subtitle: 'What brings you to plant-based eating?', type: 'goals' },
  { id: 6, title: 'Dietary Restrictions', subtitle: 'Any restrictions?', type: 'restrictions' },
  { id: 7, title: 'Food Allergies', subtitle: 'What should we avoid?', type: 'allergies' },
  { id: 8, title: 'Favorite Cuisines', subtitle: 'What flavors do you love?', type: 'cuisines' },
  { id: 9, title: 'Ingredient Preferences', subtitle: 'Likes and dislikes', type: 'ingredients' },
  { id: 10, title: 'Texture & Flavor', subtitle: 'How do you like your food?', type: 'textures' },
  { id: 11, title: 'Cooking Skills', subtitle: 'Your kitchen experience', type: 'cookingLevel' },
  { id: 12, title: 'Kitchen Equipment', subtitle: 'What tools do you have?', type: 'equipment' },
  { id: 13, title: 'Meal Planning', subtitle: 'Your eating habits', type: 'mealPreferences' },
  { id: 14, title: 'Health Goals', subtitle: 'What are you aiming for?', type: 'health' },
  { id: 15, title: 'Budget & Shopping', subtitle: 'Your preferences', type: 'budget' },
  { id: 16, title: 'Your Location', subtitle: 'Find stores near you', type: 'location' },
  { id: 17, title: 'Additional Notes', subtitle: 'Anything else?', type: 'notes' },
  { id: 18, title: 'All Set! 🎉', subtitle: 'Your personalized plan is ready', type: 'complete' }
];

const DIETARY_GOALS = [
  { id: 'health', label: 'Better Health', icon: '💪', description: 'Improve overall wellness' },
  { id: 'environment', label: 'Environment', icon: '🌍', description: 'Reduce carbon footprint' },
  { id: 'animals', label: 'Animal Welfare', icon: '🐮', description: 'Ethical considerations' },
  { id: 'weight', label: 'Weight Management', icon: '⚖️', description: 'Healthy weight goals' },
  { id: 'energy', label: 'More Energy', icon: '⚡', description: 'Boost daily energy' },
  { id: 'curious', label: 'Just Curious', icon: '🤔', description: 'Exploring options' }
];

const VEGAN_DURATIONS = [
  { id: 'just-starting', label: 'Just Starting', icon: '🌱', description: 'Brand new to veganism' },
  { id: '<6months', label: 'Less than 6 months', icon: '🌿', description: 'Still learning' },
  { id: '6-12months', label: '6-12 months', icon: '🌳', description: 'Getting comfortable' },
  { id: '1-2years', label: '1-2 years', icon: '🌲', description: 'Experienced' },
  { id: '2+years', label: '2+ years', icon: '🏆', description: 'Vegan veteran' }
];

const MOTIVATIONS = [
  { id: 'health', label: 'Health', icon: '💪', description: 'Better wellness' },
  { id: 'environment', label: 'Environment', icon: '🌍', description: 'Save the planet' },
  { id: 'animal-welfare', label: 'Animal Welfare', icon: '🐮', description: 'Ethical choice' },
  { id: 'religious', label: 'Religious/Spiritual', icon: '🙏', description: 'Faith-based' },
  { id: 'cost', label: 'Cost Savings', icon: '💰', description: 'Budget-friendly' },
  { id: 'other', label: 'Other', icon: '🤔', description: 'Different reason' }
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
  { id: 'quick', label: 'Quick Meals', icon: '⚡', description: 'Under 30 minutes' },
  { id: 'batch', label: 'Batch Cooking', icon: '🍱', description: 'Meal prep friendly' },
  { id: 'gourmet', label: 'Gourmet', icon: '👨‍🍳', description: 'Restaurant quality' },
  { id: 'comfort', label: 'Comfort Food', icon: '🍲', description: 'Hearty & satisfying' },
  { id: 'healthy', label: 'Health-Focused', icon: '🥗', description: 'Nutrient-dense' },
  { id: 'international', label: 'International', icon: '🌍', description: 'World cuisines' }
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

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { currentUser, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Personal
    age: '',
    householdSize: 1,
    householdType: '',
    
    // Vegan Journey
    veganDuration: '',
    motivations: [],
    
    // Dietary
    goals: [],
    restrictions: [],
    allergies: [],
    
    // Food Preferences
    favoriteCuisines: [],
    dislikedIngredients: '',
    preferredIngredients: '',
    spiceTolerance: 'medium',
    texturePreferences: [],
    flavorProfiles: [],
    
    // Cooking
    cookingLevel: '',
    timeAvailable: 30,
    equipment: [],
    
    // Meal Planning
    mealPreferences: [],
    mealsPerDay: 3,
    
    // Health
    primaryHealthGoal: '',
    calorieTarget: 2000,
    
    // Budget
    budget: 'medium',
    shoppingFrequency: 'weekly',
    
    // Location
    location: {
      address: '',
      coordinates: [0, 0]
    },
    
    // Notes
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
      
      // Save comprehensive onboarding data
      await usersAPI.saveOnboardingStep(
        token,
        currentUser.uid,
        18,
        {
          personal: {
            age: formData.age,
            householdSize: formData.householdSize,
            householdType: formData.householdType
          },
          veganJourney: {
            duration: formData.veganDuration,
            motivations: formData.motivations
          },
          dietary: {
            goals: formData.goals,
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
            skillLevel: formData.cookingLevel,
            timeAvailable: formData.timeAvailable,
            equipment: formData.equipment
          },
          mealPlanning: {
            mealPreferences: formData.mealPreferences,
            mealsPerDay: formData.mealsPerDay
          },
          health: {
            primaryGoal: formData.primaryHealthGoal,
            calorieTarget: formData.calorieTarget
          },
          budget: {
            level: formData.budget,
            shoppingFrequency: formData.shoppingFrequency
          },
          location: formData.location,
          additionalNotes: formData.additionalNotes
        }
      );

      // Mark onboarding as complete
      await usersAPI.completeOnboarding(token, currentUser.uid);

      // Wait for profile to refresh and verify completion
      await refreshProfile();
      
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      case 'personal':
        return formData.age !== '';
      case 'household':
        return formData.householdType !== '';
      case 'veganJourney':
        return formData.veganDuration !== '' && formData.motivations.length > 0;
      case 'goals':
        return formData.goals.length > 0;
      case 'restrictions':
        return formData.restrictions.length > 0;
      case 'allergies':
        return formData.allergies.length > 0;
      case 'cuisines':
        return formData.favoriteCuisines.length > 0;
      case 'ingredients':
        return true; // Optional
      case 'textures':
        return formData.texturePreferences.length > 0 && formData.flavorProfiles.length > 0;
      case 'cookingLevel':
        return formData.cookingLevel !== '';
      case 'equipment':
        return formData.equipment.length > 0;
      case 'mealPreferences':
        return formData.mealPreferences.length > 0;
      case 'health':
        return formData.primaryHealthGoal !== '';
      case 'budget':
        return true; // Optional
      case 'location':
        return true; // Optional
      case 'notes':
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

              {step.type === 'personal' && (
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
              )}

              {step.type === 'household' && (
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
              )}

              {step.type === 'veganJourney' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How long have you been vegan/plant-based?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {VEGAN_DURATIONS.map((duration) => (
                        <motion.button
                          key={duration.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, veganDuration: duration.id })}
                          className={`p-6 rounded-xl border-2 transition text-left ${
                            formData.veganDuration === duration.id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="text-4xl mb-2">{duration.icon}</div>
                          <div className="font-semibold text-gray-900">{duration.label}</div>
                          <div className="text-sm text-gray-600">{duration.description}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What motivated you to go vegan? (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {MOTIVATIONS.map((motivation) => (
                        <motion.button
                          key={motivation.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleSelection('motivations', motivation.id)}
                          className={`p-4 rounded-lg border-2 transition ${
                            formData.motivations.includes(motivation.id)
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="text-3xl mb-1">{motivation.icon}</div>
                          <div className="text-sm font-medium text-gray-900">{motivation.label}</div>
                          <div className="text-xs text-gray-600">{motivation.description}</div>
                        </motion.button>
                      ))}
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

              {step.type === 'allergies' && (
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
              )}

              {step.type === 'cuisines' && (
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
              )}

              {step.type === 'ingredients' && (
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
              )}

              {step.type === 'textures' && (
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

              {step.type === 'equipment' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {EQUIPMENT.map(equip => (
                    <motion.button
                      key={equip.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleSelection('equipment', equip.id)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.equipment.includes(equip.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{equip.icon}</div>
                      <p className="text-sm font-medium text-gray-900">{equip.label}</p>
                    </motion.button>
                  ))}
                </div>
              )}

              {step.type === 'health' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {HEALTH_GOALS.map(goal => (
                      <motion.button
                        key={goal.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData(prev => ({ ...prev, primaryHealthGoal: goal.id }))}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          formData.primaryHealthGoal === goal.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">{goal.icon}</div>
                        <p className="text-sm font-medium text-gray-900">{goal.label}</p>
                      </motion.button>
                    ))}
                  </div>
                  <div className="max-w-md mx-auto mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Calorie Target (optional)
                    </label>
                    <input
                      type="number"
                      value={formData.calorieTarget}
                      onChange={(e) => setFormData(prev => ({ ...prev, calorieTarget: parseInt(e.target.value) || 2000 }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                      placeholder="2000"
                    />
                  </div>
                </div>
              )}

              {step.type === 'budget' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Level
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    >
                      <option value="low">Budget-Friendly</option>
                      <option value="medium">Moderate</option>
                      <option value="high">Premium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shopping Frequency
                    </label>
                    <select
                      value={formData.shoppingFrequency}
                      onChange={(e) => setFormData(prev => ({ ...prev, shoppingFrequency: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meals Per Day
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={formData.mealsPerDay}
                      onChange={(e) => setFormData(prev => ({ ...prev, mealsPerDay: parseInt(e.target.value) || 3 }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              )}

              {step.type === 'notes' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-4">📝</div>
                    <p className="text-gray-600">
                      Is there anything else we should know? Any specific preferences, dietary needs, or information we might have missed?
                    </p>
                  </div>
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    rows="6"
                    placeholder="Tell us anything else that would help us personalize your experience..."
                  />
                  <p className="text-sm text-gray-500 text-center">
                    This helps us provide the most personalized recommendations for you!
                  </p>
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
