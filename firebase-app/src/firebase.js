// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { initializeFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCs9YeUdOj9T0bvGXVNkOPA9Gw_5IDfkxM",
  authDomain: "c-market-place-fccd0.firebaseapp.com",
  projectId: "c-market-place-fccd0",
  storageBucket: "c-market-place-fccd0.appspot.com",
  messagingSenderId: "1086849841777",
  appId: "1:1086849841777:web:48371f3b09d7e0f92ff9d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);