const admin = require('firebase-admin');
const { MongoClient, ObjectId } = require('mongodb');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing Firebase Admin credentials');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
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

  try {
    // Verify Firebase token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (authError) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const firebaseUid = decodedToken.uid;
    const client = await connectToDatabase();
    const db = client.db('vegan-diet-app');
    const shoppingListsCollection = db.collection('shoppingLists');

    // GET - Retrieve shopping list
    if (req.method === 'GET') {
      const shoppingList = await shoppingListsCollection.findOne({ 
        userId: firebaseUid 
      });
      
      if (!shoppingList) {
        return res.status(404).json({ error: 'Shopping list not found' });
      }
      
      return res.status(200).json(shoppingList);
    }

    // POST - Create or update shopping list
    if (req.method === 'POST') {
      const { 
        weeklyMenuId, 
        items, 
        customItems, 
        checkedItems, 
        itemNotes,
        weekStart,
        weekEnd,
        byCategory,
        byStore,
        byDay,
        nearbyStores,
        estimatedCost
      } = req.body;

      const shoppingListData = {
        userId: firebaseUid,
        weeklyMenuId,
        items: items || [],
        customItems: customItems || [],
        checkedItems: checkedItems || {},
        itemNotes: itemNotes || {},
        weekStart,
        weekEnd,
        byCategory: byCategory || {},
        byStore: byStore || {},
        byDay: byDay || {},
        nearbyStores: nearbyStores || [],
        estimatedCost: estimatedCost || 0,
        updatedAt: new Date(),
        createdAt: new Date()
      };

      const result = await shoppingListsCollection.updateOne(
        { userId: firebaseUid },
        { $set: shoppingListData },
        { upsert: true }
      );

      const updatedList = await shoppingListsCollection.findOne({ 
        userId: firebaseUid 
      });

      return res.status(200).json(updatedList);
    }

    // PUT - Update checked items or custom items
    if (req.method === 'PUT') {
      const { checkedItems, customItems, itemNotes } = req.body;

      const updateData = {
        updatedAt: new Date()
      };

      if (checkedItems !== undefined) {
        updateData.checkedItems = checkedItems;
      }
      if (customItems !== undefined) {
        updateData.customItems = customItems;
      }
      if (itemNotes !== undefined) {
        updateData.itemNotes = itemNotes;
      }

      await shoppingListsCollection.updateOne(
        { userId: firebaseUid },
        { $set: updateData }
      );

      const updatedList = await shoppingListsCollection.findOne({ 
        userId: firebaseUid 
      });

      return res.status(200).json(updatedList);
    }

    // DELETE - Delete shopping list
    if (req.method === 'DELETE') {
      await shoppingListsCollection.deleteOne({ userId: firebaseUid });
      return res.status(200).json({ message: 'Shopping list deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error in shopping-list:', error);
    return res.status(500).json({ error: error.message });
  }
};
