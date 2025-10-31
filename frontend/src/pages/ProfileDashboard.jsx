import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEdit, FaSave, FaTimes, FaUtensils, FaStore, FaCalendar, FaTrophy } from 'react-icons/fa';
import { checkAchievements, calculateProfileCompletion } from '../utils/achievementSystem';
import AchievementBadge from '../components/AchievementBadge';
import StreakTracker from '../components/StreakTracker';
import ProfileCompletionBar from '../components/ProfileCompletionBar';
import ProfileSection from '../components/ProfileSection';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { ACHIEVEMENTS } from '../utils/achievementSystem';
import { usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { debounce } from '../utils/debounce';

export default function ProfileDashboard() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [formData, setFormData] = useState({});
  
  // Ref for debounced save
  const debouncedSaveRef = useRef(null);

  useEffect(() => {
    if (userProfile) {
      setLoading(false);
      setAchievements(checkAchievements(userProfile));
      setProfileCompletion(calculateProfileCompletion(userProfile));
      setFormData(userProfile);
    }
  }, [userProfile]);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (sectionData) => {
      try {
        setSaving(true);
        const token = await currentUser.getIdToken();
        await usersAPI.updateProfile(token, sectionData);
        await refreshProfile();
        toast.success('Profile updated successfully!', { autoClose: 2000 });
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
      } finally {
        setSaving(false);
      }
    }, 1000),
    [currentUser, refreshProfile]
  );

  const handleSaveSection = async (sectionData) => {
    debouncedSave(sectionData);
  };

  // Handle input changes with debouncing
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <LoadingSkeleton type="header" />
            <div className="mt-6">
              <LoadingSkeleton type="stats" count={3} />
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <LoadingSkeleton type="card" count={3} />
          </div>

          {/* Gamification Widgets Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <LoadingSkeleton type="card" count={3} />
          </div>

          {/* Profile Sections Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <LoadingSkeleton type="section" count={5} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Saving Indicator */}
        {saving && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2"
            role="status"
            aria-live="polite"
          >
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Saving...</span>
          </motion.div>
        )}

        {/* Header Section with Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {userProfile?.name || 'Friend'}! 👋
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Here's your vegan journey at a glance</p>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-around sm:justify-end">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600" aria-label={`${achievements.length} achievements earned`}>
                  {achievements.length}
                </div>
                <div className="text-xs text-gray-500">Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600" aria-label={`${userProfile?.loginStreak || 0} day login streak`}>
                  {userProfile?.loginStreak || 0}
                </div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600" aria-label={`${profileCompletion}% profile complete`}>
                  {profileCompletion}%
                </div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
          </div>

          {/* Achievement Badges Preview */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide" role="list" aria-label="Recent achievements">
            <span className="text-sm font-medium text-gray-700 mr-2 flex-shrink-0">Recent:</span>
            {Object.values(ACHIEVEMENTS).slice(0, 6).map((achievement) => {
              const earned = achievements.some(a => a.id === achievement.id);
              return (
                <div key={achievement.id} role="listitem">
                  <AchievementBadge
                    achievement={achievement}
                    earned={earned}
                    size="sm"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6" role="navigation" aria-label="Quick actions">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dish-input')}
            className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg p-4 sm:p-6 text-left hover:shadow-xl transition focus:outline-none focus:ring-4 focus:ring-green-300"
            aria-label="Find vegan alternative recipes"
          >
            <FaUtensils className="text-3xl sm:text-4xl mb-3" aria-hidden="true" />
            <h3 className="text-lg sm:text-xl font-bold mb-2">Find Vegan Alternative</h3>
            <p className="text-green-100 text-xs sm:text-sm">Get AI-powered vegan recipe suggestions</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/stores')}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-4 sm:p-6 text-left hover:shadow-xl transition focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label="Find vegan-friendly stores nearby"
          >
            <FaStore className="text-3xl sm:text-4xl mb-3" aria-hidden="true" />
            <h3 className="text-lg sm:text-xl font-bold mb-2">Find Stores</h3>
            <p className="text-blue-100 text-xs sm:text-sm">Locate vegan-friendly stores nearby</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/weekly-menu')}
            className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl shadow-lg p-4 sm:p-6 text-left hover:shadow-xl transition focus:outline-none focus:ring-4 focus:ring-purple-300 sm:col-span-2 lg:col-span-1"
            aria-label="Plan your weekly menu"
          >
            <FaCalendar className="text-3xl sm:text-4xl mb-3" aria-hidden="true" />
            <h3 className="text-lg sm:text-xl font-bold mb-2">Weekly Menu</h3>
            <p className="text-purple-100 text-xs sm:text-sm">Plan your meals for the week</p>
          </motion.button>
        </div>

        {/* Gamification Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <ProfileCompletionBar completion={profileCompletion} />
          <StreakTracker 
            streak={userProfile?.loginStreak || 0} 
            maxStreak={userProfile?.maxLoginStreak || 0} 
          />
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Achievements</h3>
              <FaTrophy className="text-xl sm:text-2xl text-yellow-500" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3" role="list" aria-label="Achievement badges">
              {Object.values(ACHIEVEMENTS).map((achievement) => {
                const earned = achievements.some(a => a.id === achievement.id);
                return (
                  <div key={achievement.id} role="listitem">
                    <AchievementBadge
                      achievement={achievement}
                      earned={earned}
                      size="md"
                    />
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => {/* Show all achievements modal */}}
              className="w-full mt-4 text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 rounded py-1"
              aria-label="View all achievements"
            >
              View All Achievements →
            </button>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Your Profile Details</h2>
          
          {/* Personal Information */}
          <ProfileSection
            title="Personal Information"
            icon="👤"
            defaultOpen={true}
            onSave={() => handleSaveSection({
              name: formData.name,
              email: formData.email,
              age: formData.age
            })}
          >
            {(isEditing) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      aria-label="Name"
                      autoComplete="name"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile?.name || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-gray-900">{userProfile?.email}</p>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.age || ''}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      aria-label="Age"
                      min="1"
                      max="120"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile?.age || 'Not set'}</p>
                  )}
                </div>
              </div>
            )}
          </ProfileSection>

          {/* Vegan Journey */}
          <ProfileSection
            title="Vegan Journey"
            icon="🌱"
            onSave={() => handleSaveSection({
              veganDuration: formData.veganDuration,
              motivations: formData.motivations
            })}
          >
            {(isEditing) => (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <p className="text-gray-900">{userProfile?.veganDuration || 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motivations</label>
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.motivations?.map((motivation) => (
                      <span key={motivation} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {motivation}
                      </span>
                    )) || <p className="text-gray-500">Not set</p>}
                  </div>
                </div>
              </div>
            )}
          </ProfileSection>

          {/* Dietary Goals */}
          <ProfileSection
            title="Dietary Goals"
            icon="🎯"
            onSave={() => handleSaveSection({
              goals: formData.goals
            })}
          >
            {(isEditing) => (
              <div className="flex flex-wrap gap-2">
                {userProfile?.goals?.map((goal) => (
                  <span key={goal} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {goal}
                  </span>
                )) || <p className="text-gray-500">Not set</p>}
              </div>
            )}
          </ProfileSection>

          {/* Health Profile */}
          <ProfileSection
            title="Health Profile"
            icon="🏥"
            onSave={() => handleSaveSection({
              healthConditions: formData.healthConditions,
              isPregnant: formData.isPregnant,
              isBreastfeeding: formData.isBreastfeeding
            })}
          >
            {(isEditing) => (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Health Conditions</label>
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.healthConditions?.map((condition) => (
                      <span key={condition} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        {condition}
                      </span>
                    )) || <p className="text-gray-500">None</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={userProfile?.isPregnant} disabled className="rounded" />
                    <span className="text-sm text-gray-700">Pregnant 🤰</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={userProfile?.isBreastfeeding} disabled className="rounded" />
                    <span className="text-sm text-gray-700">Breastfeeding 🤱</span>
                  </label>
                </div>
              </div>
            )}
          </ProfileSection>

          {/* Fitness & Activity */}
          <ProfileSection
            title="Fitness & Activity"
            icon="💪"
            onSave={() => handleSaveSection({
              fitnessLevel: formData.fitnessLevel,
              exerciseTypes: formData.exerciseTypes,
              fitnessGoals: formData.fitnessGoals
            })}
          >
            {(isEditing) => (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                  <p className="text-gray-900">{userProfile?.fitnessLevel || 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Types</label>
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.exerciseTypes?.map((type) => (
                      <span key={type} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {type}
                      </span>
                    )) || <p className="text-gray-500">Not set</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Goals</label>
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.fitnessGoals?.map((goal) => (
                      <span key={goal} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                        {goal}
                      </span>
                    )) || <p className="text-gray-500">Not set</p>}
                  </div>
                </div>
              </div>
            )}
          </ProfileSection>

          {/* Dietary Restrictions & Allergies */}
          <ProfileSection
            title="Dietary Restrictions & Allergies"
            icon="⚠️"
            onSave={() => handleSaveSection({
              restrictions: formData.restrictions,
              allergies: formData.allergies
            })}
          >
            {(isEditing) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restrictions</label>
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.restrictions?.map((restriction) => (
                      <span key={restriction} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                        {restriction}
                      </span>
                    )) || <p className="text-gray-500">None</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.allergies?.map((allergy) => (
                      <span key={allergy} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        {allergy}
                      </span>
                    )) || <p className="text-gray-500">None</p>}
                  </div>
                </div>
              </div>
            )}
          </ProfileSection>

          {/* Food Preferences */}
          <ProfileSection
            title="Food Preferences"
            icon="🍽️"
            onSave={() => handleSaveSection({
              favoriteCuisines: formData.favoriteCuisines,
              texturePreferences: formData.texturePreferences,
              flavorProfiles: formData.flavorProfiles
            })}
          >
            {(isEditing) => (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Cuisines</label>
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.favoriteCuisines?.map((cuisine) => (
                      <span key={cuisine} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        {cuisine}
                      </span>
                    )) || <p className="text-gray-500">Not set</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Texture Preferences</label>
                    <div className="flex flex-wrap gap-2">
                      {userProfile?.texturePreferences?.map((texture) => (
                        <span key={texture} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                          {texture}
                        </span>
                      )) || <p className="text-gray-500">Not set</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Flavor Profiles</label>
                    <div className="flex flex-wrap gap-2">
                      {userProfile?.flavorProfiles?.map((flavor) => (
                        <span key={flavor} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                          {flavor}
                        </span>
                      )) || <p className="text-gray-500">Not set</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ProfileSection>

          {/* Cooking & Equipment */}
          <ProfileSection
            title="Cooking & Equipment"
            icon="👨‍🍳"
            onSave={() => handleSaveSection({
              cookingSkills: formData.cookingSkills,
              kitchenEquipment: formData.kitchenEquipment,
              timeAvailable: formData.timeAvailable
            })}
          >
            {(isEditing) => (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cooking Skills</label>
                  <p className="text-gray-900">{userProfile?.cookingSkills || 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kitchen Equipment</label>
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.kitchenEquipment?.map((equipment) => (
                      <span key={equipment} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {equipment}
                      </span>
                    )) || <p className="text-gray-500">Not set</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Available for Cooking</label>
                  <p className="text-gray-900">{userProfile?.timeAvailable || 'Not set'}</p>
                </div>
              </div>
            )}
          </ProfileSection>

          {/* Meal Planning & Budget */}
          <ProfileSection
            title="Meal Planning & Budget"
            icon="💰"
            onSave={() => handleSaveSection({
              budgetPerWeek: formData.budgetPerWeek,
              shoppingFrequency: formData.shoppingFrequency,
              mealPlanningStyle: formData.mealPlanningStyle
            })}
          >
            {(isEditing) => (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Budget</label>
                  <p className="text-gray-900">{userProfile?.budgetPerWeek ? `$${userProfile.budgetPerWeek}` : 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shopping Frequency</label>
                  <p className="text-gray-900">{userProfile?.shoppingFrequency || 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Planning Style</label>
                  <p className="text-gray-900">{userProfile?.mealPlanningStyle || 'Not set'}</p>
                </div>
              </div>
            )}
          </ProfileSection>

          {/* Location & Additional Notes */}
          <ProfileSection
            title="Location & Additional Notes"
            icon="📍"
            onSave={() => handleSaveSection({
              location: formData.location,
              additionalNotes: formData.additionalNotes
            })}
          >
            {(isEditing) => (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <p className="text-gray-900">{userProfile?.location || 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <p className="text-gray-900">{userProfile?.additionalNotes || 'No additional notes'}</p>
                </div>
              </div>
            )}
          </ProfileSection>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Account Settings</h2>

          <ProfileSection
            title="Account Management"
            icon="⚙️"
            editable={false}
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Delete Account</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Permanently delete your account and all data</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      console.log('Account deletion requested');
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition focus:outline-none focus:ring-4 focus:ring-red-300"
                  aria-label="Delete account permanently"
                >
                  Delete Account
                </button>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Export Data</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Download all your profile data</p>
                </div>
                <button
                  onClick={() => {
                    console.log('Data export requested');
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-300"
                  aria-label="Export your profile data"
                >
                  Export Data
                </button>
              </div>
            </div>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
}
