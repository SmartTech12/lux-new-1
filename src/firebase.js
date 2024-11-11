// Import necessary Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIhvqMP69h748zWVNEYjAmDvZE4HENhOM",
  authDomain: "luxuy-6ce34.firebaseapp.com",
  projectId: "luxuy-6ce34",
  storageBucket: "luxuy-6ce34.appspot.com",
  messagingSenderId: "138068825489",
  appId: "1:138068825489:web:b35f8d7ed9863003fc3630",
  measurementId: "G-8NP3T48JW4"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize App Check with ReCaptcha V3 provider
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('Adgjmptw'), // Replace with your site key
  isTokenAutoRefreshEnabled: true
});
