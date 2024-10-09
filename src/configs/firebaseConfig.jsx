// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
 apiKey: "AIzaSyDSYX5ikDstxC82LrC6jK8AC5lVNxl3mJA",
  authDomain: "cinema-ccead.firebaseapp.com",
  projectId: "cinema-ccead",
  storageBucket: "cinema-ccead.appspot.com",
  messagingSenderId: "417829055772",
  appId: "1:417829055772:web:1b4161a4742318b14b1ed9",
  measurementId: "G-X0D6ZLYPHQ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp)

export { firebaseApp, auth };
