const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

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
