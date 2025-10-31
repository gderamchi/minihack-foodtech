// 22-Step Onboarding Configuration
export const STEPS = [
  { id: 1, title: 'Welcome! 🌱', subtitle: "Let's personalize your vegan journey", type: 'welcome' },
  { id: 2, title: 'Personal Information', subtitle: 'Tell us about yourself', type: 'personal' },
  { id: 3, title: 'Your Vegan Journey', subtitle: 'Where are you in your journey?', type: 'veganJourney' },
  { id: 4, title: 'Dietary Goals', subtitle: 'What brings you to plant-based eating?', type: 'goals' },
  { id: 5, title: 'Health Conditions', subtitle: 'Any health considerations?', type: 'healthConditions' },
  { id: 6, title: 'Dietary Restrictions', subtitle: 'Any restrictions we should know?', type: 'restrictions' },
  { id: 7, title: 'Food Allergies', subtitle: 'What should we avoid?', type: 'allergies' },
  { id: 8, title: 'Favorite Cuisines', subtitle: 'What flavors do you love?', type: 'cuisines' },
  { id: 9, title: 'Meal Timing', subtitle: 'When do you eat?', type: 'mealTiming' },
  { id: 10, title: 'Cooking Skills', subtitle: 'Your experience in the kitchen', type: 'cooking' },
  { id: 11, title: 'Meal Planning', subtitle: 'Your eating habits', type: 'mealPlanning' },
  { id: 12, title: 'Nutrition Goals', subtitle: 'What are you aiming for?', type: 'nutrition' },
  { id: 13, title: 'Fitness & Activity', subtitle: 'Your activity level', type: 'fitness' },
  { id: 14, title: 'Budget & Shopping', subtitle: 'Your shopping preferences', type: 'budget' },
  { id: 15, title: 'Social & Lifestyle', subtitle: 'Your social eating habits', type: 'lifestyle' },
  { id: 16, title: 'Learning & Growth', subtitle: 'How do you want to learn?', type: 'learning' },
  { id: 17, title: 'Environmental Values', subtitle: 'Your sustainability priorities', type: 'environmental' },
  { id: 18, title: 'Time Management', subtitle: 'Your daily schedule', type: 'timeManagement' },
  { id: 19, title: 'Food Waste & Storage', subtitle: 'Your kitchen setup', type: 'foodWaste' },
  { id: 20, title: 'Special Occasions', subtitle: 'Celebrations and events', type: 'specialOccasions' },
  { id: 21, title: 'Technology Preferences', subtitle: 'Your tech comfort level', type: 'technology' },
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

export const DIETARY_GOALS = [
  { id: 'health', label: 'Better Health', icon: '💪' },
  { id: 'weight-management', label: 'Weight Management', icon: '⚖️' },
  { id: 'energy', label: 'More Energy', icon: '⚡' },
  { id: 'environment', label: 'Environment', icon: '🌍' },
  { id: 'animal-welfare', label: 'Animal Welfare', icon: '🐮' },
  { id: 'athletic-performance', label: 'Athletic Performance', icon: '🏃' },
  { id: 'disease-prevention', label: 'Disease Prevention', icon: '🛡️' },
  { id: 'longevity', label: 'Longevity', icon: '🌟' }
];

export const HEALTH_CONDITIONS = [
  { id: 'none', label: 'None', icon: '✅' },
  { id: 'diabetes', label: 'Diabetes', icon: '🩺' },
  { id: 'high-bp', label: 'High Blood Pressure', icon: '❤️' },
  { id: 'high-cholesterol', label: 'High Cholesterol', icon: '📊' },
  { id: 'heart-disease', label: 'Heart Disease', icon: '💔' },
  { id: 'digestive-issues', label: 'Digestive Issues', icon: '🌿' },
  { id: 'thyroid', label: 'Thyroid Issues', icon: '🦋' },
  { id: 'pcos', label: 'PCOS', icon: '🔬' }
];

export const RESTRICTIONS = [
  { id: 'none', label: 'No Restrictions', icon: '✅' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'soy-free', label: 'Soy-Free', icon: '🫘' },
  { id: 'oil-free', label: 'Oil-Free', icon: '🫗' },
  { id: 'low-sodium', label: 'Low Sodium', icon: '🧂' },
  { id: 'low-sugar', label: 'Low Sugar', icon: '🍬' },
  { id: 'raw-food', label: 'Raw Food', icon: '🥗' }
];

export const ALLERGIES = [
  { id: 'none', label: 'No Allergies', icon: '✅' },
  { id: 'peanuts', label: 'Peanuts', icon: '🥜' },
  { id: 'tree-nuts', label: 'Tree Nuts', icon: '🌰' },
  { id: 'soy', label: 'Soy', icon: '🫘' },
  { id: 'wheat', label: 'Wheat/Gluten', icon: '🌾' },
  { id: 'sesame', label: 'Sesame', icon: '🫘' }
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

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', icon: '🛋️', description: 'Little to no exercise' },
  { id: 'lightly-active', label: 'Lightly Active', icon: '🚶', description: '1-3 days/week' },
  { id: 'moderately-active', label: 'Moderately Active', icon: '🏃', description: '3-5 days/week' },
  { id: 'very-active', label: 'Very Active', icon: '💪', description: '6-7 days/week' },
  { id: 'athlete', label: 'Athlete', icon: '🏆', description: 'Professional training' }
];

export const BUDGET_LEVELS = [
  { id: 'low', label: 'Budget-Friendly', icon: '💰', description: 'Cost-conscious' },
  { id: 'medium', label: 'Moderate', icon: '💵', description: 'Balanced approach' },
  { id: 'high', label: 'Premium', icon: '💎', description: 'Quality first' }
];

export const HOUSEHOLD_TYPES = [
  { id: 'single', label: 'Just Me', icon: '👤' },
  { id: 'couple', label: 'Couple', icon: '👫' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'roommates', label: 'Roommates', icon: '🏠' }
];

export const LEARNING_INTERESTS = [
  { id: 'nutrition-basics', label: 'Nutrition Basics', icon: '📚' },
  { id: 'meal-prep', label: 'Meal Prep', icon: '🍱' },
  { id: 'budget-shopping', label: 'Budget Shopping', icon: '🛒' },
  { id: 'restaurant-tips', label: 'Restaurant Tips', icon: '🍽️' },
  { id: 'baking', label: 'Baking', icon: '🍰' },
  { id: 'fermentation', label: 'Fermentation', icon: '🫙' },
  { id: 'sprouting', label: 'Sprouting', icon: '🌱' }
];

export const TECH_DEVICES = [
  { id: 'none', label: 'None', icon: '❌' },
  { id: 'smart-oven', label: 'Smart Oven', icon: '🔥' },
  { id: 'instant-pot', label: 'Instant Pot', icon: '🍲' },
  { id: 'air-fryer', label: 'Air Fryer', icon: '🍟' },
  { id: 'sous-vide', label: 'Sous Vide', icon: '🌡️' }
];
