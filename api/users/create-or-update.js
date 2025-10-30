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
    throw error; // Don't continue if Firebase fails to initialize
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
    // Check if Firebase Admin is initialized
    if (!admin.apps.length) {
      console.error('Firebase Admin not initialized');
      return res.status(500).json({ error: 'Firebase Admin initialization failed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      const { firebaseUid, email, name } = req.body;

      if (!firebaseUid || !email) {
        return res.status(400).json({ error: 'Firebase UID and email are required' });
      }

      if (decodedToken.uid !== firebaseUid) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    } catch (authError) {
      console.error('Token verification error:', authError);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const client = await connectToDatabase();
    const db = client.db('vegan-diet-app');
    const usersCollection = db.collection('users');

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
  } catch (error) {
    console.error('Error in create-or-update:', error);
    return res.status(500).json({ error: error.message });
  }
};
