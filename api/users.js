const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const { MongoClient, ObjectId } = require('mongodb');

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
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Parse the URL to determine the action
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Remove 'api' and 'users' from path
    const action = pathParts[pathParts.length - 1];

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db('vegan-diet-app');
    const usersCollection = db.collection('users');

    // Route to appropriate handler
    switch (action) {
      case 'create-or-update':
        return await handleCreateOrUpdate(req, res, admin, usersCollection);
      
      case 'profile':
        return await handleProfile(req, res, admin, usersCollection);
      
      case 'update-profile':
        return await handleUpdateProfile(req, res, admin, usersCollection);
      
      case 'onboarding':
        return await handleOnboarding(req, res, admin, usersCollection);
      
      case 'delete-account':
        return await handleDeleteAccount(req, res, admin, db);
      
      default:
        return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Error in users API:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Handler: Create or Update User
async function handleCreateOrUpdate(req, res, admin, usersCollection) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);

  const { firebaseUid, email, name } = req.body;

  if (!firebaseUid || !email) {
    return res.status(400).json({ error: 'Firebase UID and email are required' });
  }

  if (decodedToken.uid !== firebaseUid) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const existingUser = await usersCollection.findOne({ firebaseUid });

  if (existingUser) {
    await usersCollection.updateOne(
      { firebaseUid },
      { 
        $set: { 
          email, 
          name: name || existingUser.name,
          updatedAt: new Date() 
        } 
      }
    );
    const updatedUser = await usersCollection.findOne({ firebaseUid });
    return res.status(200).json(updatedUser);
  } else {
    const newUser = {
      firebaseUid,
      email,
      name: name || email.split('@')[0],
      preferences: {},
      onboardingCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await usersCollection.insertOne(newUser);
    return res.status(201).json(newUser);
  }
}

// Handler: Get Profile
async function handleProfile(req, res, admin, usersCollection) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);

  const url = new URL(req.url, `http://${req.headers.host}`);
  const firebaseUid = url.searchParams.get('firebaseUid');

  if (!firebaseUid) {
    return res.status(400).json({ error: 'Firebase UID is required' });
  }

  if (decodedToken.uid !== firebaseUid) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const user = await usersCollection.findOne({ firebaseUid });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json({ user });
}

// Handler: Update Profile
async function handleUpdateProfile(req, res, admin, usersCollection) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);
  const firebaseUid = decodedToken.uid;

  const updateData = { ...req.body };
  delete updateData.firebaseUid;
  delete updateData.email;
  updateData.updatedAt = new Date();

  await usersCollection.updateOne(
    { firebaseUid },
    { $set: updateData }
  );

  const updatedUser = await usersCollection.findOne({ firebaseUid });
  return res.status(200).json(updatedUser);
}

// Handler: Onboarding
async function handleOnboarding(req, res, admin, usersCollection) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);

  const { firebaseUid, step, data, complete } = req.body;

  if (!firebaseUid) {
    return res.status(400).json({ error: 'Firebase UID is required' });
  }

  if (decodedToken.uid !== firebaseUid) {
    return res.status(403).json({ error: 'Forbidden' });
  }

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
    await usersCollection.updateOne(
      { firebaseUid },
      { 
        $set: { 
          [`onboardingData.step${step}`]: data,
          preferences: { ...user.preferences, ...data },
          updatedAt: new Date()
        } 
      }
    );
    const updatedUser = await usersCollection.findOne({ firebaseUid });
    return res.status(200).json(updatedUser);
  }

  return res.status(400).json({ error: 'Invalid request' });
}

// Handler: Delete Account
async function handleDeleteAccount(req, res, admin, db) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);
  const firebaseUid = decodedToken.uid;

  const url = new URL(req.url, `http://${req.headers.host}`);
  const requestFirebaseUid = url.searchParams.get('firebaseUid');

  if (firebaseUid !== requestFirebaseUid) {
    return res.status(403).json({ error: 'Forbidden: Can only delete your own account' });
  }

  const usersCollection = db.collection('users');
  const deleteResult = await usersCollection.deleteOne({ firebaseUid });

  const weeklyMenusCollection = db.collection('weeklymenus');
  await weeklyMenusCollection.deleteMany({ userId: firebaseUid });

  try {
    await admin.auth().deleteUser(firebaseUid);
  } catch (firebaseError) {
    console.error('Error deleting Firebase user:', firebaseError);
  }

  return res.status(200).json({ 
    message: 'Account deleted successfully',
    deletedFromMongoDB: deleteResult.deletedCount > 0
  });
}
