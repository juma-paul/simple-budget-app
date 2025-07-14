// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "the-simple-budget-app.firebaseapp.com",
  projectId: "the-simple-budget-app",
  storageBucket: "the-simple-budget-app.firebasestorage.app",
  messagingSenderId: "155182027477",
  appId: "1:155182027477:web:7ebdfdaf903a2ea299885c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
