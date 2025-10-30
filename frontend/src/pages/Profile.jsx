import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { usersAPI } from '../services/api';
import { 
  FaUser, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaTrash,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaRedo,
  FaCog
} from 'react-icons/fa';

export default function Profile() {
  const { currentUser, userProfile, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: userProfile?.user?.name || currentUser?.displayName || '',
    email: userProfile?.user?.email || currentUser?.email || '',
    location: userProfile?.user?.location?.address || ''
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: userProfile?.user?.name || currentUser?.displayName || '',
      email: userProfile?.user?.email || currentUser?.email || '',
      location: userProfile?.user?.location?.address || ''
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      
      await usersAPI.updateProfile(token, currentUser.uid, {
        name: formData.name,
        location: {
          address: formData.location,
          coordinates: userProfile?.user?.location?.coordinates || [0, 0]
        }
      });

      await refreshProfile();
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeOnboarding = () => {
    navigate('/onboarding');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      
      // Delete user from backend
      await usersAPI.deleteAccount(token, currentUser.uid);
      
      // Delete Firebase user
      await currentUser.delete();
      
      toast.success('Account deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        toast.error('Please log in again before deleting your account');
        await signOut();
        navigate('/login');
      } else {
        toast.error('Failed to delete account. Please try again.');
      }
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          <FaUser className="inline mr-3 text-green-600" />
          Profile & Settings
        </h1>
        <p className="text-gray-600">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          {!editing ? (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition"
            >
              <FaEdit className="inline mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                <FaTimes className="inline mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
              >
                <FaSave className="inline mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline mr-2 text-gray-400" />
              Name
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your name"
              />
            ) : (
              <p className="text-lg text-gray-900">{formData.name || 'Not set'}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaEnvelope className="inline mr-2 text-gray-400" />
              Email
            </label>
            <p className="text-lg text-gray-900">{formData.email}</p>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaMapMarkerAlt className="inline mr-2 text-gray-400" />
              Location
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="City, Country"
              />
            ) : (
              <p className="text-lg text-gray-900">{formData.location || 'Not set'}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Preferences Summary */}
      {userProfile?.preferences && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Preferences</h2>
            <button
              onClick={handleRetakeOnboarding}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition"
            >
              <FaRedo className="inline mr-2" />
              Retake Questionnaire
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProfile.preferences.dietaryGoals && userProfile.preferences.dietaryGoals.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Dietary Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.preferences.dietaryGoals.map((goal, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
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
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm capitalize">
                  {userProfile.preferences.cookingLevel}
                </span>
              </div>
            )}

            {userProfile.preferences.dietaryRestrictions && userProfile.preferences.dietaryRestrictions.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Dietary Restrictions</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.preferences.dietaryRestrictions.map((restriction, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      {restriction}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(!userProfile.preferences.dietaryGoals || userProfile.preferences.dietaryGoals.length === 0) && (
            <div className="text-center py-8">
              <FaCog className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No preferences set yet</p>
              <button
                onClick={handleRetakeOnboarding}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
              >
                Complete Questionnaire
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Actions</h2>
        
        <div className="space-y-4">
          {/* Retake Onboarding */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Update Preferences</h3>
              <p className="text-sm text-gray-600">
                Retake the questionnaire to update your dietary preferences and goals
              </p>
            </div>
            <button
              onClick={handleRetakeOnboarding}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition whitespace-nowrap"
            >
              <FaRedo className="inline mr-2" />
              Retake
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-2 border-red-200">
            <div>
              <h3 className="font-semibold text-red-900 mb-1 flex items-center">
                <FaExclamationTriangle className="mr-2" />
                Delete Account
              </h3>
              <p className="text-sm text-red-700">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition whitespace-nowrap"
            >
              <FaTrash className="inline mr-2" />
              Delete
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-3xl text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Account?</h2>
              <p className="text-gray-600">
                This will permanently delete your account and all associated data including:
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <ul className="space-y-2 text-sm text-red-900">
                <li>• Your profile and preferences</li>
                <li>• All saved recipes and menus</li>
                <li>• Your meal plans and history</li>
                <li>• All account data</li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold text-red-600">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="DELETE"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE' || loading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
