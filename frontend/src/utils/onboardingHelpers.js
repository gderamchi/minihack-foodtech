// Onboarding Helper Functions

const STORAGE_KEY = 'vegan_onboarding_progress';

/**
 * Save onboarding progress to localStorage
 * @param {Number} step - Current step number
 * @param {Object} formData - Form data object
 */
export function saveOnboardingProgress(step, formData) {
  try {
    const data = {
      step,
      formData,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save onboarding progress:', error);
  }
}

/**
 * Load onboarding progress from localStorage
 * @returns {Object|null} Saved progress or null
 */
export function loadOnboardingProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    
    // Check if saved data is less than 7 days old
    const savedDate = new Date(data.timestamp);
    const now = new Date();
    const daysDiff = (now - savedDate) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > 7) {
      // Data too old, clear it
      clearOnboardingProgress();
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to load onboarding progress:', error);
    return null;
  }
}

/**
 * Clear onboarding progress from localStorage
 */
export function clearOnboardingProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear onboarding progress:', error);
  }
}

/**
 * Validate step data before proceeding
 * @param {String} stepType - Type of step
 * @param {Object} formData - Form data
 * @returns {Boolean} Whether step is valid
 */
export function validateStep(stepType, formData) {
  switch (stepType) {
    case 'welcome':
      return true;
      
    case 'personal':
      return formData.age && formData.age > 0 && formData.age < 120;
      
    case 'household':
      return formData.householdType && formData.householdSize > 0;
      
    case 'veganJourney':
      return formData.veganDuration && formData.veganMotivations?.length > 0;
      
    case 'goals':
      return formData.goals?.length > 0;
      
    case 'healthConditions':
      return true; // Optional step
      
    case 'restrictions':
      return formData.restrictions?.length > 0;
      
    case 'allergies':
      return formData.allergies?.length > 0;
      
    case 'cuisines':
      return formData.favoriteCuisines?.length > 0;
      
    case 'ingredients':
      return true; // Optional
      
    case 'mealTiming':
      return formData.mealsPerDay > 0;
      
    case 'cooking':
      return formData.skillLevel;
      
    case 'equipment':
      return formData.equipment?.length > 0;
      
    case 'mealPlanning':
      return formData.mealTypes?.length > 0;
      
    case 'nutrition':
      return formData.primaryGoal;
      
    case 'fitness':
      return formData.activityLevel;
      
    case 'budget':
      return formData.budget;
      
    case 'lifestyle':
      return true; // Optional
      
    case 'learning':
      return true; // Optional
      
    case 'environmental':
      return true; // Optional
      
    case 'timeManagement':
      return true; // Optional
      
    case 'foodManagement':
      return true; // Optional
      
    case 'specialOccasions':
      return true; // Optional
      
    case 'technology':
      return true; // Optional
      
    case 'automation':
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
}

/**
 * Get validation error message for a step
 * @param {String} stepType - Type of step
 * @returns {String} Error message
 */
export function getValidationMessage(stepType) {
  const messages = {
    personal: 'Please enter a valid age',
    household: 'Please select your household type and size',
    veganJourney: 'Please tell us about your vegan journey',
    goals: 'Please select at least one goal',
    restrictions: 'Please select your dietary restrictions (or "No Restrictions")',
    allergies: 'Please select your allergies (or "No Allergies")',
    cuisines: 'Please select at least one favorite cuisine',
    mealTiming: 'Please specify how many meals per day',
    cooking: 'Please select your cooking skill level',
    equipment: 'Please select at least one piece of equipment',
    mealPlanning: 'Please select at least one meal type',
    nutrition: 'Please select your primary nutrition goal',
    fitness: 'Please select your activity level',
    budget: 'Please select your budget level'
  };
  
  return messages[stepType] || 'Please complete this step';
}

/**
 * Debounce function for auto-save
 * @param {Function} func - Function to debounce
 * @param {Number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 1000) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Transform form data to API format
 * @param {Object} formData - Form data from state
 * @returns {Object} Formatted data for API
 */
export function transformFormDataForAPI(formData) {
  return {
    personal: {
      age: parseInt(formData.age) || null,
      gender: formData.gender || null,
      height: parseInt(formData.height) || null,
      weight: parseInt(formData.weight) || null,
      householdSize: parseInt(formData.householdSize) || 1,
      householdType: formData.householdType || null,
      location: formData.location || { address: '', coordinates: [] }
    },
    veganJourney: {
      duration: formData.veganDuration || null,
      motivations: formData.veganMotivations || [],
      transitionChallenges: formData.veganChallenges || [],
      supportLevel: formData.veganSupport || null
    },
    dietaryGoals: formData.goals || [],
    healthConditions: {
      conditions: formData.healthConditions || [],
      isPregnant: formData.isPregnant || false,
      isBreastfeeding: formData.isBreastfeeding || false,
      supplements: formData.supplements || [],
      medications: formData.medications || []
    },
    dietary: {
      restrictions: formData.restrictions || [],
      allergies: formData.allergies || [],
      specificAllergies: formData.specificAllergies || '',
      intolerances: formData.intolerances || []
    },
    foodPreferences: {
      favoriteCuisines: formData.favoriteCuisines || [],
      mealComplexity: formData.mealComplexity || 'moderate',
      proteinPreferences: formData.proteinPreferences || [],
      milkAlternatives: formData.milkAlternatives || [],
      preferredIngredients: Array.isArray(formData.preferredIngredients) 
        ? formData.preferredIngredients 
        : (formData.preferredIngredients || '').split(',').map(i => i.trim()).filter(Boolean),
      dislikedIngredients: Array.isArray(formData.dislikedIngredients)
        ? formData.dislikedIngredients
        : (formData.dislikedIngredients || '').split(',').map(i => i.trim()).filter(Boolean),
      spiceTolerance: formData.spiceTolerance || 'medium',
      sweetnessPreference: formData.sweetnessPreference || 'medium',
      saltinessPreference: formData.saltinessPreference || 'medium',
      texturePreferences: formData.texturePreferences || [],
      flavorProfiles: formData.flavorProfiles || []
    },
    mealTiming: {
      breakfastTime: formData.breakfastTime || null,
      lunchTime: formData.lunchTime || null,
      dinnerTime: formData.dinnerTime || null,
      intermittentFasting: formData.intermittentFasting || false,
      fastingWindow: formData.fastingWindow || null,
      mealsPerDay: parseInt(formData.mealsPerDay) || 3,
      snacksBetweenMeals: formData.snacksBetweenMeals || false,
      mealSizes: formData.mealSizes || '3-regular'
    },
    cooking: {
      skillLevel: formData.skillLevel || 'beginner',
      cookingFrequency: formData.cookingFrequency || 'daily',
      favoriteMethods: formData.cookingMethods || [],
      timeAvailable: parseInt(formData.timeAvailable) || 30,
      equipment: formData.equipment || [],
      mealPrepRoutine: formData.mealPrepRoutine || false,
      mealPrepDay: formData.mealPrepDay || null,
      cookingConfidence: parseInt(formData.cookingConfidence) || 5
    },
    mealPlanning: {
      preferences: formData.mealPlanningPreferences || [],
      leftoverPreference: formData.leftoverPreference || 'okay',
      recipeVariety: formData.recipeVariety || 'mix',
      mealTypes: formData.mealTypes || [],
      planningHorizon: formData.planningHorizon || 'weekly',
      flexibilityLevel: formData.flexibilityLevel || 'flexible'
    },
    nutrition: {
      primaryGoal: formData.primaryGoal || null,
      calorieTarget: parseInt(formData.calorieTarget) || 2000,
      macroFocus: formData.macroFocus || 'balanced',
      proteinTarget: parseInt(formData.proteinTarget) || null,
      micronutrientConcerns: formData.micronutrientConcerns || [],
      trackNutrition: formData.trackNutrition || false
    },
    fitness: {
      activityLevel: formData.activityLevel || 'moderately-active',
      exerciseRoutine: formData.exerciseRoutine || [],
      exerciseFrequency: formData.exerciseFrequency || 'rarely',
      fitnessGoals: formData.fitnessGoals || []
    },
    budget: {
      level: formData.budget || 'medium',
      weeklyBudget: parseInt(formData.weeklyBudget) || null,
      shoppingFrequency: formData.shoppingFrequency || 'weekly',
      preferredLocations: formData.shoppingLocations || [],
      organicPreference: formData.organicPreference || 'when-possible',
      seasonalEating: formData.seasonalEating || false
    },
    lifestyle: {
      eatOutFrequency: formData.eatOutFrequency || 'rarely',
      cookForNonVegans: formData.cookForNonVegans || false,
      nonVeganHousehold: formData.nonVeganHousehold || false,
      socialChallenges: formData.socialChallenges || [],
      workSchedule: formData.workSchedule || 'regular'
    },
    learning: {
      nutritionEducation: formData.nutritionEducation || false,
      cookingTutorials: formData.cookingTutorials || false,
      interests: formData.learningInterests || [],
      learningStyle: formData.learningStyle || 'all'
    },
    environmental: {
      carbonFootprintConcern: formData.carbonFootprintConcern || false,
      localSourcing: formData.localSourcing || false,
      sustainabilityPriority: formData.sustainabilityPriority || 'medium'
    },
    timeManagement: {
      morningRoutine: formData.morningRoutine || 'moderate',
      eveningRoutine: formData.eveningRoutine || 'moderate',
      weekdayAvailability: parseInt(formData.weekdayAvailability) || 30,
      weekendAvailability: parseInt(formData.weekendAvailability) || 60
    },
    foodManagement: {
      wasteReduction: formData.wasteReduction || false,
      composting: formData.composting || false,
      freezerUsage: formData.freezerUsage || 'occasional'
    },
    specialOccasions: {
      holidayMeals: formData.holidayMeals || false,
      entertainingStyle: formData.entertainingStyle || 'casual'
    },
    technology: {
      smartKitchenDevices: formData.smartKitchenDevices || [],
      mealPlanningApps: formData.mealPlanningApps || false,
      techComfort: formData.techComfort || 'comfortable'
    },
    additionalInfo: {
      notes: formData.additionalNotes || '',
      shortTermGoals: formData.shortTermGoals || '',
      mediumTermGoals: formData.mediumTermGoals || '',
      longTermGoals: formData.longTermGoals || ''
    },
    automation: {
      enabled: formData.automationEnabled || false,
      startDay: formData.startDay || 'sunday',
      daysInAdvance: parseInt(formData.daysInAdvance) || 7,
      notifications: formData.notifications || false
    }
  };
}

/**
 * Get skipped sections from form data
 * @param {Object} formData - Form data
 * @returns {Array} Array of skipped section names
 */
export function getSkippedSections(formData) {
  const skipped = [];
  
  if (!formData.veganDuration) skipped.push('veganJourney');
  if (!formData.healthConditions?.length) skipped.push('healthConditions');
  if (!formData.mealTiming) skipped.push('mealTiming');
  if (!formData.fitness) skipped.push('fitness');
  if (!formData.lifestyle) skipped.push('lifestyle');
  if (!formData.learning) skipped.push('learning');
  if (!formData.environmental) skipped.push('environmental');
  if (!formData.timeManagement) skipped.push('timeManagement');
  if (!formData.foodManagement) skipped.push('foodManagement');
  if (!formData.specialOccasions) skipped.push('specialOccasions');
  if (!formData.technology) skipped.push('technology');
  
  return skipped;
}
