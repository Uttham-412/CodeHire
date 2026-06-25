const admin = require('firebase-admin');

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

let auth = null;
let firestore = null;
let storage = null;
let isInitialized = false;
let initError = null;

const hasCredentials = projectId && clientEmail && privateKey;

if (!hasCredentials) {
  initError = "Firebase configuration credentials are missing from the environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).";
} else {
  try {
    let formattedPrivateKey = privateKey;
    if (formattedPrivateKey.startsWith('"') && formattedPrivateKey.endsWith('"')) {
      formattedPrivateKey = formattedPrivateKey.substring(1, formattedPrivateKey.length - 1);
    }
    formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, '\n');

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedPrivateKey,
        }),
        storageBucket: storageBucket || undefined
      });
    }

    auth = admin.auth();
    firestore = admin.firestore();
    storage = admin.storage();
    isInitialized = true;
  } catch (error) {
    initError = error.message;
  }
}

module.exports = {
  admin,
  auth,
  firestore,
  storage,
  isInitialized,
  initError
};
