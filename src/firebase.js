// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAIhvqMP69h748zWVNEYjAmDvZE4HENhOM",
  authDomain: "luxuy-6ce34.firebaseapp.com",
  projectId: "luxuy-6ce34",
  storageBucket: "luxuy-6ce34.appspot.com",
  messagingSenderId: "138068825489",
  appId: "1:138068825489:web:b35f8d7ed9863003fc3630",
  measurementId: "G-8NP3T48JW4"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the Firebase Auth instance
const db = getFirestore(app); // Get the Firestore instance

export { auth, db };
