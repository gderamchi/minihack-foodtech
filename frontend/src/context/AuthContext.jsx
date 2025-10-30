import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { usersAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user profile from backend
        try {
          const token = await user.getIdToken();
          const profile = await usersAPI.getProfile(token);
          setUserProfile(profile.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // If profile doesn't exist, user needs to complete onboarding
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshProfile = async () => {
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        const profile = await usersAPI.getProfile(token);
        setUserProfile(profile.data);
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    refreshProfile,
    isAuthenticated: !!currentUser,
    needsOnboarding: currentUser && (!userProfile || !userProfile.onboardingCompleted)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
