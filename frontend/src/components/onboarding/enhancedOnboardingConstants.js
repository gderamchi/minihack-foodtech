// Enhanced Onboarding Constants - All 22 Steps

export const ENHANCED_STEPS = [
  { id: 1, title: 'Welcome! 🌱', subtitle: "Let's personalize your vegan journey", type: 'welcome' },
  { id: 2, title: 'Personal Information', subtitle: 'Tell us about yourself', type: 'personal' },
  { id: 3, title: 'Your Vegan Journey', subtitle: 'Where are you in your transition?', type: 'veganJourney' },
  { id: 4, title: 'Dietary Goals', subtitle: 'What brings you here?', type: 'goals' },
  { id: 5, title: 'Health Conditions', subtitle: 'Any health considerations?', type: 'healthConditions' },
  { id: 6, title: 'Restrictions & Allergies', subtitle: 'What should we avoid?', type: 'restrictions' },
  { id: 7, title: 'Favorite Cuisines', subtitle: 'What flavors do you love?', type: 'cuisines' },
  { id: 8, title: 'Meal Timing', subtitle: 'When do you eat?', type: 'mealTiming' },
  { id: 9, title: 'Cooking Skills', subtitle: 'Your kitchen experience', type: 'cooking' },
  { id: 10, title: 'Meal Planning', subtitle: 'Your eating habits', type: 'mealPlanning' },
  { id: 11, title: 'Nutrition Goals', subtitle: 'Your health targets', type: 'nutrition' },
  { id: 12, title: 'Fitness & Activity', subtitle: 'Your activity level', type: 'fitness' },
  { id: 13, title: 'Budget & Shopping', subtitle: 'Your shopping preferences', type: 'budget' },
  { id: 14, title: 'Social & Lifestyle', subtitle: 'Your daily life', type: 'lifestyle' },
  { id: 15, title: 'Learning & Growth', subtitle: 'How can we help you learn?', type: 'learning' },
  { id: 16, title: 'Environmental Impact', subtitle: 'Sustainability matters', type: 'environmental' },
  { id: 17, title: 'Time Management', subtitle: 'Your daily schedule', type: 'timeManagement' },
  { id: 18, title: 'Food Waste & Storage', subtitle: 'Kitchen organization', type: 'foodManagement' },
  { id: 19, title: 'Special Occasions', subtitle: 'Celebrations & events', type: 'specialOccasions' },
  { id: 20, title: 'Technology & Tools', subtitle: 'Your tech preferences', type: 'technology' },
  { id: 21, title: 'Additional Notes', subtitle: 'Anything else?', type: 'notes' },
  { id: 22, title: 'All Set! 🎉', subtitle: 'Your personalized plan is ready', type: 'complete' }
];

export const VEGAN_DURATIONS = [
  { id: 'just-starting', label: 'Just Starting', icon: '🌱' },
  { id: '<6months', label: 'Less than 6 months', icon: '🌿' },
  { id: '6-12months', label: '6-12 months', icon: '🍃' },
  { id: '1-2years', label: '1-2 years', icon: '🌳' },
  { id: '2+years', label: '2+ years', icon: '🌲' }
];

export const VEGAN_MOTIVATIONS = [
  { id: 'health', label: 'Health', icon: '💪' },
  { id: 'environment', label: 'Environment', icon: '🌍' },
  { id: 'animal-welfare', label: 'Animal Welfare', icon: '🐮' },
  { id: 'religious', label: 'Religious', icon: '🙏' },
  { id: 'cost', label: 'Cost Savings', icon: '💰' },
  { id: 'other', label: 'Other', icon: '🤔' }
];

export const HEALTH_CONDITIONS = [
  { id: 'diabetes', label: 'Diabetes', icon: '🩺' },
  { id: 'high-bp', label: 'High Blood Pressure', icon: '❤️' },
  { id: 'high-cholesterol', label: 'High Cholesterol', icon: '📊' },
  { id: 'heart-disease', label: 'Heart Disease', icon: '💔' },
  { id: 'digestive-issues', label: 'Digestive Issues', icon: '🌿' },
  { id: 'thyroid', label: 'Thyroid Issues', icon: '🦋' },
  { id: 'pcos', label: 'PCOS', icon: '🎗️' },
  { id: 'none', label: 'None', icon: '✅' }
];

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', icon: '🪑', description: 'Little to no exercise' },
  { id: 'lightly-active', label: 'Lightly Active', icon: '🚶', description: '1-3 days/week' },
  { id: 'moderately-active', label: 'Moderately Active', icon: '🏃', description: '3-5 days/week' },
  { id: 'very-active', label: 'Very Active', icon: '💪', description: '6-7 days/week' },
  { id: 'athlete', label: 'Athlete', icon: '🏆', description: 'Intense training' }
];

export const EXERCISE_TYPES = [
  { id: 'cardio', label: 'Cardio', icon: '🏃' },
  { id: 'strength', label: 'Strength Training', icon: '💪' },
  { id: 'yoga', label: 'Yoga', icon: '🧘' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'none', label: 'None', icon: '🚫' }
];

export const MEAL_TIMES = [
  { id: 'early-morning', label: '6-8 AM', value: '07:00' },
  { id: 'morning', label: '8-10 AM', value: '09:00' },
  { id: 'late-morning', label: '10-12 PM', value: '11:00' },
  { id: 'noon', label: '12-2 PM', value: '13:00' },
  { id: 'afternoon', label: '2-4 PM', value: '15:00' },
  { id: 'evening', label: '6-8 PM', value: '19:00' },
  { id: 'late-evening', label: '8-10 PM', value: '21:00' }
];

export const LEARNING_INTERESTS = [
  { id: 'nutrition-basics', label: 'Nutrition Basics', icon: '📚' },
  { id: 'meal-prep', label: 'Meal Prep', icon: '🍱' },
  { id: 'budget-shopping', label: 'Budget Shopping', icon: '💰' },
  { id: 'restaurant-tips', label: 'Restaurant Tips', icon: '🍽️' },
  { id: 'baking', label: 'Vegan Baking', icon: '🧁' },
  { id: 'fermentation', label: 'Fermentation', icon: '🥒' }
];

export const SMART_DEVICES = [
  { id: 'instant-pot', label: 'Instant Pot', icon: '🍲' },
  { id: 'air-fryer', label: 'Air Fryer', icon: '🍟' },
  { id: 'sous-vide', label: 'Sous Vide', icon: '🌡️' },
  { id: 'smart-oven', label: 'Smart Oven', icon: '🔥' },
  { id: 'none', label: 'None', icon: '🚫' }
];

export const DIETARY_GOALS = [
  { id: 'health', label: 'Better Health', icon: '💪' },
  { id: 'environment', label: 'Environment', icon: '🌍' },
  { id: 'animals', label: 'Animal Welfare', icon: '🐮' },
  { id: 'weight', label: 'Weight Management', icon: '⚖️' },
  { id: 'energy', label: 'More Energy', icon: '⚡' },
  { id: 'athletic-performance', label: 'Athletic Performance', icon: '🏃' },
  { id: 'disease-prevention', label: 'Disease Prevention', icon: '🛡️' },
  { id: 'longevity', label: 'Longevity', icon: '🌟' }
];

export const RESTRICTIONS = [
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'soy-free', label: 'Soy-Free', icon: '🫘' },
  { id: 'oil-free', label: 'Oil-Free', icon: '🫗' },
  { id: 'low-sodium', label: 'Low Sodium', icon: '🧂' },
  { id: 'low-sugar', label: 'Low Sugar', icon: '🍬' },
  { id: 'raw-food', label: 'Raw Food', icon: '🥗' },
  { id: 'none', label: 'No Restrictions', icon: '✅' }
];

export const ALLERGIES = [
  { id: 'peanuts', label: 'Peanuts', icon: '🥜' },
  { id: 'tree-nuts', label: 'Tree Nuts', icon: '🌰' },
  { id: 'soy', label: 'Soy', icon: '🫘' },
  { id: 'wheat', label: 'Wheat/Gluten', icon: '🌾' },
  { id: 'sesame', label: 'Sesame', icon: '🫘' },
  { id: 'none', label: 'No Allergies', icon: '✅' }
];

export const CUISINES = [
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

export const COOKING_LEVELS = [
  { id: 'beginner', label: 'Beginner', icon: '👶', description: 'Simple recipes' },
  { id: 'intermediate', label: 'Intermediate', icon: '👨‍🍳', description: 'Can follow recipes' },
  { id: 'advanced', label: 'Advanced', icon: '⭐', description: 'Love cooking!' }
];

export const EQUIPMENT = [
  { id: 'stove', label: 'Stove/Oven', icon: '🔥' },
  { id: 'microwave', label: 'Microwave', icon: '📻' },
  { id: 'blender', label: 'Blender', icon: '🌀' },
  { id: 'food-processor', label: 'Food Processor', icon: '⚙️' },
  { id: 'air-fryer', label: 'Air Fryer', icon: '🍟' },
  { id: 'instant-pot', label: 'Instant Pot', icon: '🍲' },
  { id: 'slow-cooker', label: 'Slow Cooker', icon: '⏰' },
  { id: 'rice-cooker', label: 'Rice Cooker', icon: '🍚' }
];

export const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'lunch', label: 'Lunch', icon: '🥗' },
  { id: 'dinner', label: 'Dinner', icon: '🍽️' },
  { id: 'snacks', label: 'Snacks', icon: '🍿' }
];

export const NUTRITION_GOALS = [
  { id: 'weight-loss', label: 'Weight Loss', icon: '⚖️' },
  { id: 'muscle-gain', label: 'Muscle Gain', icon: '💪' },
  { id: 'heart-health', label: 'Heart Health', icon: '❤️' },
  { id: 'energy', label: 'More Energy', icon: '⚡' },
  { id: 'digestion', label: 'Better Digestion', icon: '🌿' },
  { id: 'general', label: 'General Health', icon: '🏃' }
];

export const HOUSEHOLD_TYPES = [
  { id: 'single', label: 'Just Me', icon: '👤' },
  { id: 'couple', label: 'Couple', icon: '👫' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'roommates', label: 'Roommates', icon: '🏠' }
];

export const BUDGET_LEVELS = [
  { id: 'low', label: 'Budget-Friendly', icon: '💵', description: 'Under $50/week' },
  { id: 'medium', label: 'Moderate', icon: '💰', description: '$50-100/week' },
  { id: 'high', label: 'Premium', icon: '💎', description: '$100+/week' }
];

export const SUSTAINABILITY_PRIORITIES = [
  { id: 'high', label: 'Very Important', icon: '🌍' },
  { id: 'medium', label: 'Somewhat Important', icon: '🌿' },
  { id: 'low', label: 'Not a Priority', icon: '🤷' }
];
