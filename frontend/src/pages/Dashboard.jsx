import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUtensils, FaStore, FaCalendar, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Dashboard() {
  const { currentUser, userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-xl">🌱</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {userProfile?.name || currentUser?.displayName || 'Friend'}!
                </h1>
                <p className="text-sm text-gray-600">Your vegan journey dashboard</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Update Profile Banner */}
        {userProfile?.user?.onboardingCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 mb-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">✨</div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Your Profile is Set Up!</h3>
                  <p className="text-green-100">
                    Want to update your preferences? You can edit your profile anytime.
                  </p>
                </div>
              </div>
              <Link
                to="/profile"
                className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition whitespace-nowrap"
              >
                Update Profile
              </Link>
            </div>
          </motion.div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaUtensils className="text-green-600 text-xl" />
              </div>
              <span className="text-3xl font-bold text-gray-900">0</span>
            </div>
            <p className="text-gray-600 font-medium">Recipes Saved</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaCalendar className="text-blue-600 text-xl" />
              </div>
              <span className="text-3xl font-bold text-gray-900">0</span>
            </div>
            <p className="text-gray-600 font-medium">Meal Plans</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaStore className="text-purple-600 text-xl" />
              </div>
              <span className="text-3xl font-bold text-gray-900">900+</span>
            </div>
            <p className="text-gray-600 font-medium">Stores Available</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaUser className="text-orange-600 text-xl" />
              </div>
              <span className="text-sm font-bold text-green-600">ACTIVE</span>
            </div>
            <p className="text-gray-600 font-medium">Account Status</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/dish-input">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 text-white cursor-pointer"
              >
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-2">Generate Vegan Recipe</h3>
                <p className="text-green-100">
                  Enter any dish and get an AI-powered vegan alternative
                </p>
              </motion.div>
            </Link>

            <Link to="/store-locator">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white cursor-pointer"
              >
                <div className="text-4xl mb-4">🛒</div>
                <h3 className="text-xl font-bold mb-2">Find Stores</h3>
                <p className="text-blue-100">
                  Discover nearby stores with vegan ingredients
                </p>
              </motion.div>
            </Link>

            <Link to="/menus">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-8 text-white cursor-pointer"
              >
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-bold mb-2">Browse Menus</h3>
                <p className="text-purple-100">
                  Explore curated vegan meal plans and menus
                </p>
              </motion.div>
            </Link>
          </div>
        </div>

        {/* User Preferences Summary */}
        {userProfile?.preferences && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userProfile.preferences.dietaryGoals && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Dietary Goals</h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.preferences.dietaryGoals.map(goal => (
                      <span key={goal} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {userProfile.preferences.currentDiet && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Current Diet</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {userProfile.preferences.currentDiet}
                  </span>
                </div>
              )}

              {userProfile.preferences.cookingLevel && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Cooking Level</h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {userProfile.preferences.cookingLevel}
                  </span>
                </div>
              )}

              {userProfile.preferences.dietaryRestrictions && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Dietary Restrictions</h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.preferences.dietaryRestrictions.map(restriction => (
                      <span key={restriction} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                        {restriction}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
