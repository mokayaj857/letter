const admin = require('firebase-admin');
require('dotenv').config();

let firebaseApp = null;

/**
 * Initialize firebase-admin from a service account JSON.
 * Looks for config in this order:
 *  1. process.env.FIREBASE_SERVICE_ACCOUNT  (JSON string)
 *  2. process.env.GOOGLE_APPLICATION_CREDENTIALS  (path to JSON file)
 *  3. process.env.FIREBASE_PROJECT_ID with Application Default Credentials
 */
function initFirebaseAdmin() {
  if (firebaseApp) return firebaseApp;

  let options = {};
  let credential = null;

  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  try {
    if (saJson) {
      credential = admin.credential.cert(JSON.parse(saJson));
    } else if (saPath) {
      credential = admin.credential.cert(saPath);
    }

    if (credential) {
      firebaseApp = admin.initializeApp({ credential });
    } else if (process.env.FIREBASE_PROJECT_ID) {
      // Fallback to Application Default Credentials
      options = { projectId: process.env.FIREBASE_PROJECT_ID };
      admin.initializeApp(options);
      firebaseApp = admin.app();
    } else {
      console.warn('⚠️  firebase-admin: no service account configured. Firebase token verification disabled.');
      return null;
    }
  } catch (err) {
    console.warn('⚠️  firebase-admin failed to initialize:', err.message);
    return null;
  }

  return firebaseApp;
}

const adminApp = initFirebaseAdmin();

module.exports = {
  admin,
  adminApp,
  isFirebaseReady: () => Boolean(adminApp),
};
