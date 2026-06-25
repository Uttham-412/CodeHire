import { initializeApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, Auth } from 'firebase/auth';

// Firebase configuration using Vite env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Log loaded Firebase configuration (masking the API key for security)
console.log('Firebase config loaded:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '***' : undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});

// Initialize Firebase App and services
const app = initializeApp(firebaseConfig);
const analytics: Analytics = getAnalytics(app);
const auth: Auth = getAuth(app);

// Helper auth functions
function registerUser(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

function logoutUser() {
  return signOut(auth);
}

function getCurrentUser() {
  return auth.currentUser;
}

async function getIdToken() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is signed in');
  }
  return await user.getIdToken();
}

export {
  app,
  analytics,
  auth,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getIdToken,
};
