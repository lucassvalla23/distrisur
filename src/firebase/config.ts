import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYX1UPNg9m-BiIluBIXqDZGhmol3Wgpz0",
  authDomain: "distri-sur.firebaseapp.com",
  projectId: "distri-sur",
  storageBucket: "distri-sur.firebasestorage.app",
  messagingSenderId: "831665486568",
  appId: "1:831665486568:web:d81614df054cc3d2d6e75d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const timestamp = serverTimestamp;

export default app;