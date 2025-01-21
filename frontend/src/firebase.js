import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBujyVrvYr7TbV7z8L-HQJLnQKxNesYZWg",
  authDomain: "palcodeassignment-3ae10.firebaseapp.com",
  projectId: "palcodeassignment-3ae10",
  storageBucket: "palcodeassignment-3ae10.firebasestorage.app",
  messagingSenderId: "1012270218455",
  appId: "1:1012270218455:web:48f0b92a781964d4468492",
  measurementId: "G-W94J8NRZH2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };