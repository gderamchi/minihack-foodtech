import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEdit, FaSave, FaTimes, FaUtensils, FaStore, FaCalendar, FaTrophy } from 'react-icons/fa';
import { checkAchievements, calculateProfileCompletion } from '../utils/achievementSystem';
import AchievementBadge from '../components/AchievementBadge';
import StreakTracker from '../components/StreakTracker';
import ProfileCompletionBar from '../components/ProfileCompletionBar';
import { ACHIEVEMENTS } from '../utils/achievementSystem';

export default function ProfileDashboard() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    if (userProfile) {
      setLoading(false);
      setAchievements(checkAchievements(userProfile));
      setProfileCompletion(calculateProfileCompletion(userProfile));
    }
  }, [userProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userProfile?.name || 'Friend'}! 👋
              </h1>
              <p className="text-gray-600 mt-2">Here's your vegan journey at a glance</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{achievements.length}</div>
                <div className="text-xs text-gray-500">Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{userProfile?.loginStreak || 0}</div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{profileCompletion}%</div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
          </div>

          {/* Achievement Badges Preview */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Recent:</span>
            {Object.values(ACHIEVEMENTS).slice(0, 6).map((achievement) => {
              const earned = achievements.some(a => a.id === achievement.id);
              return (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  earned={earned}
                  size="sm"
                />
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dish-input')}
            className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition"
          >
            <FaUtensils className="text-4xl mb-3" />
            <h3 className="text-xl font-bold mb-2">Find Vegan Alternative</h3>
            <p className="text-green-100 text-sm">Get AI-powered vegan recipe suggestions</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/stores')}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition"
          >
            <FaStore className="text-4xl mb-3" />
            <h3 className="text-xl font-bold mb-2">Find Stores</h3>
            <p className="text-blue-100 text-sm">Locate vegan-friendly stores nearby</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/weekly-menu')}
            className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition"
          >
            <FaCalendar className="text-4xl mb-3" />
            <h3 className="text-xl font-bold mb-2">Weekly Menu</h3>
            <p className="text-purple-100 text-sm">Plan your meals for the week</p>
          </motion.button>
        </div>

        {/* Gamification Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <ProfileCompletionBar completion={profileCompletion} />
          <StreakTracker 
            streak={userProfile?.loginStreak || 0} 
            maxStreak={userProfile?.maxLoginStreak || 0} 
          />
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
              <FaTrophy className="text-2xl text-yellow-500" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {Object.values(ACHIEVEMENTS).map((achievement) => {
                const earned = achievements.some(a => a.id === achievement.id);
                return (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    earned={earned}
                    size="md"
                  />
                );
              })}
            </div>
            <button
              onClick={() => {/* Show all achievements modal */}}
              className="w-full mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View All Achievements →
            </button>
          </div>
        </div>

        {/* Profile Sections - Next step */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
          <p className="text-gray-600">Profile sections will be added in next steps...</p>
        </div>
      </div>
    </div>
  );
}
