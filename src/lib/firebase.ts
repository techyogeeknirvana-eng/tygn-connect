import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEdmSYCO2shuPjUdzWHcvLYNoxcnTdsog",
  authDomain: "techyogeek-nirvana-fc04a.firebaseapp.com",
  projectId: "techyogeek-nirvana-fc04a",
  storageBucket: "techyogeek-nirvana-fc04a.firebasestorage.app",
  messagingSenderId: "793002711572",
  appId: "1:793002711572:web:bd7a1ec261f77c30c02501",
  measurementId: "G-T72LEBL8BY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app;