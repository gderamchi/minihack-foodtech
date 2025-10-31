// Achievement definitions
export const ACHIEVEMENTS = {
  WELCOME_ABOARD: {
    id: 'welcome-aboard',
    name: 'Welcome Aboard! 🌱',
    description: 'Completed your profile setup',
    icon: '🌱',
    condition: (user) => user.onboardingCompleted
  },
  PROFILE_MASTER: {
    id: 'profile-master',
    name: 'Profile Master 📋',
    description: 'Completed 100% of your profile',
    icon: '📋',
    condition: (user) => user.profileCompletion >= 100
  },
  FIRST_RECIPE: {
    id: 'first-recipe',
    name: 'First Recipe 🍳',
    description: 'Generated your first vegan recipe',
    icon: '🍳',
    condition: (user) => user.recipesGenerated >= 1
  },
  STORE_EXPLORER: {
    id: 'store-explorer',
    name: 'Store Explorer 🛒',
    description: 'Found stores near you',
    icon: '🛒',
    condition: (user) => user.storesExplored >= 1
  },
  MEAL_PLANNER: {
    id: 'meal-planner',
    name: 'Meal Planner 📅',
    description: 'Created your first weekly menu',
    icon: '📅',
    condition: (user) => user.weeklyMenusCreated >= 1
  },
  WEEK_STREAK: {
    id: '7-day-streak',
    name: '7 Day Streak 🔥',
    description: 'Logged in for 7 consecutive days',
    icon: '🔥',
    condition: (user) => user.loginStreak >= 7
  },
  MONTH_STREAK: {
    id: '30-day-streak',
    name: '30 Day Streak 🏆',
    description: 'Logged in for 30 consecutive days',
    icon: '🏆',
    condition: (user) => user.loginStreak >= 30
  },
  RECIPE_COLLECTOR: {
    id: 'recipe-collector',
    name: 'Recipe Collector 📚',
    description: 'Saved 10 recipes',
    icon: '📚',
    condition: (user) => user.savedRecipes >= 10
  },
  GOAL_ACHIEVER: {
    id: 'goal-achiever',
    name: 'Goal Achiever ⭐',
    description: 'Reached your health goal',
    icon: '⭐',
    condition: (user) => user.goalsAchieved >= 1
  },
  ECO_WARRIOR: {
    id: 'eco-warrior',
    name: 'Eco Warrior 🌍',
    description: 'Reduced carbon footprint by going vegan',
    icon: '🌍',
    condition: (user) => user.daysVegan >= 30
  }
};

// Check which achievements user has earned
export function checkAchievements(user) {
  if (!user) return [];
  
  const earned = [];
  
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (achievement.condition(user)) {
      earned.push(achievement);
    }
  });
  
  return earned;
}

// Calculate profile completion percentage
export function calculateProfileCompletion(user) {
  if (!user) return 0;
  
  const fields = [
    'age',
    'householdType',
    'veganDuration',
    'motivations',
    'goals',
    'restrictions',
    'allergies',
    'favoriteCuisines',
    'cookingLevel',
    'equipment',
    'mealPreferences',
    'primaryHealthGoal',
    'budget',
    'location'
  ];
  
  let completed = 0;
  
  fields.forEach(field => {
    const value = user[field] || user.preferences?.[field];
    if (value) {
      if (Array.isArray(value) && value.length > 0) {
        completed++;
      } else if (typeof value === 'string' && value.trim() !== '') {
        completed++;
      } else if (typeof value === 'object' && Object.keys(value).length > 0) {
        completed++;
      } else if (typeof value === 'number') {
        completed++;
      }
    }
  });
  
  return Math.round((completed / fields.length) * 100);
}

// Get next achievement to unlock
export function getNextAchievement(user) {
  if (!user) return null;
  
  const allAchievements = Object.values(ACHIEVEMENTS);
  const earned = checkAchievements(user);
  const earnedIds = earned.map(a => a.id);
  
  const notEarned = allAchievements.filter(a => !earnedIds.includes(a.id));
  
  return notEarned[0] || null;
}
