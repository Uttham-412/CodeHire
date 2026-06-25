import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut
} from 'firebase/auth';

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "dummy-api-key-for-compilation",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "dummy-auth-domain",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "dummy-project-id",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "dummy-storage-bucket",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy-messaging-sender-id",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "dummy-app-id"
};

// Initialize Firebase Client
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getIdToken
};
