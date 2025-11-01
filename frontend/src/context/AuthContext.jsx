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
        try {
          const token = await user.getIdToken();
          
          // First, try to fetch existing profile
          try {
            const profile = await usersAPI.getProfile(token, user.uid);
            setUserProfile(profile.data);
          } catch (profileError) {
            // If profile doesn't exist (404), user needs to register
            if (profileError.response?.status === 404) {
              console.log('User not found in database - needs registration');
              setUserProfile(null);
              // Don't create user automatically - let them go through registration
            } else {
              // Other errors
              console.error('Error fetching profile:', profileError);
              setUserProfile(null);
            }
          }
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Ensure user exists in MongoDB
    const token = await userCredential.user.getIdToken();
    try {
      const profile = await usersAPI.getProfile(token, userCredential.user.uid);
      setUserProfile(profile.data);
    } catch (error) {
      if (error.response?.status === 404) {
        // User doesn't exist in MongoDB - create them
        await usersAPI.createOrUpdate({
          firebaseUid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName || userCredential.user.email.split('@')[0]
        }, token);
        
        // Fetch the newly created profile
        const newProfile = await usersAPI.getProfile(token, userCredential.user.uid);
        setUserProfile(newProfile.data);
      } else {
        throw error;
      }
    }
    
    return userCredential.user;
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    
    const token = await result.user.getIdToken();
    
    // Check if user exists in database
    try {
      const profile = await usersAPI.getProfile(token, result.user.uid);
      // User exists, update profile state
      setUserProfile(profile.data);
    } catch (error) {
      if (error.response?.status === 404) {
        // User doesn't exist - create new user
        await usersAPI.createOrUpdate({
          firebaseUid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName || result.user.email.split('@')[0]
        }, token);
        
        // Fetch the newly created profile
        const newProfile = await usersAPI.getProfile(token, result.user.uid);
        setUserProfile(newProfile.data);
      } else {
        throw error;
      }
    }

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
        const profile = await usersAPI.getProfile(token, currentUser.uid);
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
