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

const { MongoClient } = require('mongodb');

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
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify Firebase token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Get firebaseUid from body or query
    const requestFirebaseUid = req.body?.firebaseUid || req.query?.firebaseUid;

    // Verify user is deleting their own account
    if (firebaseUid !== requestFirebaseUid) {
      return res.status(403).json({ error: 'Forbidden: Can only delete your own account' });
    }

    // Connect to MongoDB
    const client = await connectToDatabase();
    const db = client.db('vegan-diet-app');

    // Delete user from MongoDB
    const usersCollection = db.collection('users');
    const deleteResult = await usersCollection.deleteOne({ firebaseUid });

    if (deleteResult.deletedCount === 0) {
      console.log(`No user found in MongoDB with firebaseUid: ${firebaseUid}`);
    }

    // Delete related data
    const weeklyMenusCollection = db.collection('weeklymenus');
    await weeklyMenusCollection.deleteMany({ userId: firebaseUid });

    // Delete user from Firebase Auth
    try {
      await admin.auth().deleteUser(firebaseUid);
    } catch (firebaseError) {
      console.error('Error deleting Firebase user:', firebaseError);
      // Continue even if Firebase deletion fails (user might have already deleted it)
    }

    res.status(200).json({ 
      message: 'Account deleted successfully',
      deletedFromMongoDB: deleteResult.deletedCount > 0
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: error.message });
  }
};
