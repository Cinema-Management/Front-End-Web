import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDBdRnh3UI-72XyhUt4mel4MEb0CmjdZ8w",
  authDomain: "otp1-afb41.firebaseapp.com",
  projectId: "otp1-afb41",
  storageBucket: "otp1-afb41.firebasestorage.app",
  messagingSenderId: "633644519491",
  appId: "1:633644519491:web:7c3a9cea94d88cfe8cc4f6",
  measurementId: "G-GPJ1TYPCH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
