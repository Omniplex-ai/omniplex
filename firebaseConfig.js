import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Firebase Config
export const firebaseConfig = {
   apiKey: "AIzaSyCdy1klP9RXKawHxOyQWMurBFUWbY_2has",
  authDomain: "omniplex-18d48.firebaseapp.com",
  projectId: "omniplex-18d48",
  storageBucket: "omniplex-18d48.firebasestorage.app",
  messagingSenderId: "1067963297425",
  appId: "1:1067963297425:web:dedc9ae9487e0047985930",
  measurementId: "G-6BC1M6W586"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

export const initializeFirebase = () => {
  return app;
};
