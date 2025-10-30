import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
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
        // Create or update user in backend
        try {
          const token = await user.getIdToken();
          await usersAPI.createOrUpdate({
            firebaseUid: user.uid,
            email: user.email,
            name: user.displayName || user.email.split('@')[0]
          }, token);

          // Fetch user profile from backend
          const profile = await usersAPI.getProfile(token);
          setUserProfile(profile.data);
        } catch (error) {
          console.error('Error syncing user:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name
    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }

    // Create user in backend
    const token = await userCredential.user.getIdToken();
    await usersAPI.createOrUpdate({
      firebaseUid: userCredential.user.uid,
      email: userCredential.user.email,
      name: name || email.split('@')[0]
    }, token);

    return userCredential.user;
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Create or update user in backend
    const token = await result.user.getIdToken();
    await usersAPI.createOrUpdate({
      firebaseUid: result.user.uid,
      email: result.user.email,
      name: result.user.displayName || result.user.email.split('@')[0]
    }, token);

    return result.user;
  };

  // Sign out
  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserProfile(null);
  };

  // Refresh profile
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
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
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
