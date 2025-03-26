// utils/FireBaseContext.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// (Opcional para web) import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBVZClT0eDU1mL3l6kxpb9mx-wYG236TzQ",
  authDomain: "sistema-pos-86fa1.firebaseapp.com",
  projectId: "sistema-pos-86fa1",
  storageBucket: "sistema-pos-86fa1.firebasestorage.app",
  messagingSenderId: "404576348614",
  appId: "1:404576348614:web:d812dd6dc5bbd5198aeac7",
  measurementId: "G-THEFVZ087T"
};

const app = initializeApp(firebaseConfig);
// (Si se requiere analytics en web, descomentar)
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
