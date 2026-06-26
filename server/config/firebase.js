const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
let getStorage = null;
try {
  getStorage = require('firebase-admin/storage').getStorage;
} catch (storageImportError) {
  console.warn('Firebase storage module unavailable:', storageImportError.message);
}

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

    const currentApps = typeof admin.getApps === 'function' ? admin.getApps() : admin.apps;
    if (!currentApps || currentApps.length === 0) {
      admin.initializeApp({
        credential: admin.cert({
          projectId,
          clientEmail,
          privateKey: formattedPrivateKey,
        }),
        storageBucket: storageBucket || undefined
      });
    }

    auth = getAuth();
    firestore = getFirestore();
    if (getStorage) {
      storage = getStorage();
    }
    isInitialized = true;
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    console.error(error.stack);
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
