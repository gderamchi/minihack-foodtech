const admin = require('firebase-admin');

let adminInstance = null;

function getFirebaseAdmin() {
  if (adminInstance) {
    return adminInstance;
  }

  if (!admin.apps.length) {
    adminInstance = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    adminInstance = admin.app();
  }

  return adminInstance;
}

module.exports = { getFirebaseAdmin, admin };
