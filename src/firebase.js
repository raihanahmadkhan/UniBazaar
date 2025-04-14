// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6subjTgPDeDpocnPkXF2EDX8HiJaO4qo",
  authDomain: "unibazaar-5bbe4.firebaseapp.com",
  projectId: "unibazaar-5bbe4",
  storageBucket: "unibazaar-5bbe4.firebasestorage.app",
  messagingSenderId: "90763887022",
  appId: "1:90763887022:web:e718d84bdfbd3f8e65083f",
  measurementId: "G-1655312HPW",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
