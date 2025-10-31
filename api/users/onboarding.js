const admin = require('firebase-admin');
const { MongoClient, ObjectId } = require('mongodb');

// Initialize Firebase Admin (safe for serverless - checks if already initialized)
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing Firebase Admin credentials in environment variables');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
    
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('CRITICAL: Firebase initialization error:', error.message);
    throw error;
  }
}

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  cachedClient = client;
  return client;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!admin.apps.length) {
      console.error('Firebase Admin not initialized');
      return res.status(500).json({ error: 'Firebase Admin initialization failed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (authError) {
      console.error('Token verification error:', authError);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { firebaseUid, step, data, complete } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({ error: 'Firebase UID is required' });
    }

    if (decodedToken.uid !== firebaseUid) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const client = await connectToDatabase();
    const db = client.db('vegan-diet-app');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (complete) {
      await usersCollection.updateOne(
        { firebaseUid },
        { 
          $set: { 
            onboardingCompleted: true,
            updatedAt: new Date()
          } 
        }
      );
      const updatedUser = await usersCollection.findOne({ firebaseUid });
      return res.status(200).json(updatedUser);
    }

    if (step && data) {
      // Transform flat data into nested profile structure
      const profileUpdate = {
        updatedAt: new Date()
      };

      // Map flat fields to nested profile structure
      if (data.age !== undefined) {
        profileUpdate['profile.personal.age'] = data.age;
        profileUpdate['age'] = data.age; // Also save flat for backward compatibility
      }
      if (data.householdSize !== undefined) {
        profileUpdate['profile.personal.householdSize'] = data.householdSize;
        profileUpdate['householdSize'] = data.householdSize;
      }
      if (data.householdType !== undefined) {
        profileUpdate['profile.personal.householdType'] = data.householdType;
        profileUpdate['householdType'] = data.householdType;
      }
      
      // Vegan Journey
      if (data.veganDuration !== undefined) {
        profileUpdate['profile.veganJourney.duration'] = data.veganDuration;
        profileUpdate['veganDuration'] = data.veganDuration;
      }
      if (data.motivations !== undefined) {
        profileUpdate['profile.veganJourney.motivations'] = data.motivations;
        profileUpdate['motivations'] = data.motivations;
      }
      
      // Health Conditions
      if (data.healthConditions !== undefined) {
        profileUpdate['profile.healthConditions.conditions'] = data.healthConditions;
        profileUpdate['healthConditions'] = data.healthConditions;
      }
      if (data.isPregnant !== undefined) {
        profileUpdate['profile.healthConditions.isPregnant'] = data.isPregnant;
        profileUpdate['isPregnant'] = data.isPregnant;
      }
      if (data.isBreastfeeding !== undefined) {
        profileUpdate['profile.healthConditions.isBreastfeeding'] = data.isBreastfeeding;
        profileUpdate['isBreastfeeding'] = data.isBreastfeeding;
      }
      
      // Fitness
      if (data.fitnessLevel !== undefined) {
        profileUpdate['profile.fitness.activityLevel'] = data.fitnessLevel;
        profileUpdate['fitnessLevel'] = data.fitnessLevel;
      }
      if (data.exerciseTypes !== undefined) {
        profileUpdate['profile.fitness.exerciseRoutine'] = data.exerciseTypes;
        profileUpdate['exerciseTypes'] = data.exerciseTypes;
      }
      if (data.fitnessGoals !== undefined) {
        profileUpdate['profile.fitness.fitnessGoals'] = data.fitnessGoals;
        profileUpdate['fitnessGoals'] = data.fitnessGoals;
      }
      
      // Dietary Goals
      if (data.goals !== undefined) {
        profileUpdate['profile.dietaryGoals'] = data.goals;
        profileUpdate['goals'] = data.goals;
      }
      
      // Restrictions & Allergies
      if (data.restrictions !== undefined) {
        profileUpdate['profile.dietary.restrictions'] = data.restrictions;
        profileUpdate['restrictions'] = data.restrictions;
      }
      if (data.allergies !== undefined) {
        profileUpdate['profile.dietary.allergies'] = data.allergies;
        profileUpdate['allergies'] = data.allergies;
      }
      
      // Food Preferences
      if (data.favoriteCuisines !== undefined) {
        profileUpdate['profile.foodPreferences.favoriteCuisines'] = data.favoriteCuisines;
        profileUpdate['favoriteCuisines'] = data.favoriteCuisines;
      }
      if (data.dislikedIngredients !== undefined) {
        profileUpdate['profile.foodPreferences.dislikedIngredients'] = data.dislikedIngredients;
        profileUpdate['dislikedIngredients'] = data.dislikedIngredients;
      }
      if (data.preferredIngredients !== undefined) {
        profileUpdate['profile.foodPreferences.preferredIngredients'] = data.preferredIngredients;
        profileUpdate['preferredIngredients'] = data.preferredIngredients;
      }
      if (data.spiceTolerance !== undefined) {
        profileUpdate['profile.foodPreferences.spiceTolerance'] = data.spiceTolerance;
        profileUpdate['spiceTolerance'] = data.spiceTolerance;
      }
      if (data.texturePreferences !== undefined) {
        profileUpdate['profile.foodPreferences.texturePreferences'] = data.texturePreferences;
        profileUpdate['texturePreferences'] = data.texturePreferences;
      }
      if (data.flavorProfiles !== undefined) {
        profileUpdate['profile.foodPreferences.flavorProfiles'] = data.flavorProfiles;
        profileUpdate['flavorProfiles'] = data.flavorProfiles;
      }
      
      // Cooking
      if (data.cookingLevel !== undefined) {
        profileUpdate['profile.cooking.skillLevel'] = data.cookingLevel;
        profileUpdate['cookingSkills'] = data.cookingLevel; // Dashboard expects this
        profileUpdate['cookingLevel'] = data.cookingLevel;
      }
      if (data.timeAvailable !== undefined) {
        profileUpdate['profile.cooking.timeAvailable'] = data.timeAvailable;
        profileUpdate['timeAvailable'] = data.timeAvailable;
      }
      if (data.equipment !== undefined) {
        profileUpdate['profile.cooking.equipment'] = data.equipment;
        profileUpdate['kitchenEquipment'] = data.equipment; // Dashboard expects this
        profileUpdate['equipment'] = data.equipment;
      }
      
      // Meal Planning
      if (data.mealPreferences !== undefined) {
        profileUpdate['profile.mealPlanning.preferences'] = data.mealPreferences;
        profileUpdate['mealPreferences'] = data.mealPreferences;
      }
      if (data.mealsPerDay !== undefined) {
        profileUpdate['profile.mealTiming.mealsPerDay'] = data.mealsPerDay;
        profileUpdate['mealsPerDay'] = data.mealsPerDay;
      }
      
      // Health Goals
      if (data.primaryHealthGoal !== undefined) {
        profileUpdate['profile.nutrition.primaryGoal'] = data.primaryHealthGoal;
        profileUpdate['primaryHealthGoal'] = data.primaryHealthGoal;
      }
      if (data.calorieTarget !== undefined) {
        profileUpdate['profile.nutrition.calorieTarget'] = data.calorieTarget;
        profileUpdate['calorieTarget'] = data.calorieTarget;
      }
      
      // Budget
      if (data.budget !== undefined) {
        profileUpdate['profile.budget.level'] = data.budget;
        profileUpdate['budget'] = data.budget;
      }
      if (data.shoppingFrequency !== undefined) {
        profileUpdate['profile.budget.shoppingFrequency'] = data.shoppingFrequency;
        profileUpdate['shoppingFrequency'] = data.shoppingFrequency;
      }
      
      // Location
      if (data.location !== undefined) {
        if (data.location.address) {
          profileUpdate['profile.personal.location.address'] = data.location.address;
          profileUpdate['location.address'] = data.location.address;
        }
        if (data.location.coordinates && data.location.coordinates.length === 2) {
          profileUpdate['profile.personal.location.type'] = 'Point';
          profileUpdate['profile.personal.location.coordinates'] = data.location.coordinates;
          profileUpdate['location.type'] = 'Point';
          profileUpdate['location.coordinates'] = data.location.coordinates;
        }
      }
      
      // Additional Notes
      if (data.additionalNotes !== undefined) {
        profileUpdate['profile.additionalInfo.notes'] = data.additionalNotes;
        profileUpdate['additionalNotes'] = data.additionalNotes;
      }

      // Save step data for tracking
      profileUpdate[`onboardingData.step${step}`] = data;

      await usersCollection.updateOne(
        { firebaseUid },
        { $set: profileUpdate }
      );
      
      const updatedUser = await usersCollection.findOne({ firebaseUid });
      return res.status(200).json(updatedUser);
    }

    return res.status(400).json({ error: 'Invalid request' });
  } catch (error) {
    console.error('Error in onboarding:', error);
    return res.status(500).json({ error: error.message });
  }
};
