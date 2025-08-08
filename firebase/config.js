import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBdJYt5Db74at6OzfdcMqg27RO53vIl7AQ",
  authDomain: "omavalvonta-a3ecc.firebaseapp.com",
  projectId: "omavalvonta-a3ecc",
  storageBucket: "omavalvonta-a3ecc.appspot.com",
  messagingSenderId: "199367067353",
  appId: "1:199367067353:web:ffd8b9e619c1b19d93a0c8",
  measurementId: "G-BZS7TLBEF6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
