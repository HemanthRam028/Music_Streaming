import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmBqUL9Ck-EyiHkk8Q_e1EPU260cd22ko",
  authDomain: "musicstreaming-c2d8d.firebaseapp.com",
  projectId: "musicstreaming-c2d8d",
  storageBucket: "musicstreaming-c2d8d.appspot.com",
  messagingSenderId: "322471070754",
  appId: "1:322471070754:web:fa8c62d51393a67028ce7b",
  measurementId: "G-TZCD1QD92N"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

// Export necessary instances
export { db, auth, provider };
