const { getFirebaseAdmin, admin } = require('../_lib/firebase-admin');
const { MongoClient, ObjectId } = require('mongodb');

// Initialize Firebase Admin
getFirebaseAdmin();


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
  } catch (error) {
    console.error('Error in onboarding:', error);
    return res.status(500).json({ error: error.message });
  }
};
